// config/redis.ts
import { createClient } from 'redis';
import { env } from './env';

export const redisClient = createClient({
  socket: {
    host: env.REDIS.HOST,
    port: env.REDIS.PORT,
  },
  password: env.REDIS.PASSWORD || undefined,
});

redisClient
  .connect()
  .then(() => console.log(' Redis connected'))
  .catch((err) => console.error(' Redis connection error:', err));