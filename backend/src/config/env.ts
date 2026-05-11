import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT),

  DB: {
    HOST: process.env.DB_HOST as string,
    PORT: Number(process.env.DB_PORT),
    USER: process.env.DB_USER as string,
    PASSWORD: process.env.DB_PASSWORD as string,
    NAME: process.env.DB_NAME as string,
  },

  SMTP: {
    HOST: process.env.MAIL_HOST as string,
    PORT: Number(process.env.MAIL_PORT),
    USER: process.env.MAIL_USERNAME as string,
    PASSWORD: process.env.MAIL_PASSWORD as string,
    FROM_NAME: process.env.MAIL_FROM_NAME as string,
    FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS as string,
    ENCRYPTION: process.env.MAIL_ENCRYPTION as string,
  },

  REDIS: {
    HOST: process.env.REDIS_HOST as string,
    PORT: Number(process.env.REDIS_PORT),
    PASSWORD: process.env.REDIS_PASSWORD,
  },
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
};