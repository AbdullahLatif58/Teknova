import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;
  public readonly details: any;

  constructor(message: string, statusCode: number, errorCode: string = 'INTERNAL_ERROR', details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wraps an async function to catch any errors and pass them to the next middleware.
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Global error handling middleware.
 */
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const status = 'error';
  const errorCode = err.errorCode || 'INTERNAL_ERROR';
  
  // Log the error for the developer
  if (statusCode === 500) {
    console.error('ERROR 💥:', err);
  }

  const response: any = {
    success: false,
    error: {
      message: err.message || 'Something went wrong!',
      code: errorCode,
      status: statusCode,
      details: err.details || null
    }
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
