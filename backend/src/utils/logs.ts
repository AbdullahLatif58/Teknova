import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'mysql2/promise';
import express, { Request, Response, NextFunction } from 'express';

interface LogOptions {
  apiEndpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  statusCode: number;
  type: 'INFO' | 'ERROR' | 'WARNING' | 'DEBUG';
  message?: string;
  userId?: string;
  extra?: object;
}


export const log = async (dbPool: Pool, options: LogOptions) => {
  const { apiEndpoint, method, statusCode, type, message, userId, extra } = options;

  const sql = `
    INSERT INTO logs (id, api_endpoint, method, status_code, type, message, user_id, extra)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await dbPool.execute(sql, [
    uuidv4(),
    apiEndpoint,
    method,
    statusCode,
    type,
    message || null,
    userId || null,
    extra ? JSON.stringify(extra) : null
  ]);
};




export const logMiddleware = (dbPool: Pool) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', async () => {
      try {
        const durationMs = Date.now() - startTime;


        let safeBody = { ...req.body };
        const sensitiveKeys = ['password', 'token', 'creditCard'];
        for (const key of Object.keys(safeBody)) {
          if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
            safeBody[key] = '*** MASKED ***';
          }
        }

        await log(dbPool, {
          apiEndpoint: req.originalUrl,
          method: req.method as any,
          statusCode: res.statusCode,
          type: res.statusCode >= 400 ? 'ERROR' : 'INFO',
          message: res.statusMessage,
          userId: req.headers['x-user-id'] as string,
          extra: {
            query: req.query,
            body: safeBody,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            durationMs
          }
        });
      } catch (err) {
        console.error('Logging failed', err);
      }
    });
    next();
  };
};