import { Queue } from 'bullmq'; // Removed QueueScheduler
import { env } from './env';

// Redis connection options
const connectionOptions = {
  host: env.REDIS.HOST,
  port: env.REDIS.PORT,
  password: env.REDIS.PASSWORD || undefined,
};

// Create the email queue
export const emailQueueName = 'emailQueue';
export const emailQueue = new Queue(emailQueueName, {
  connection: connectionOptions,
});

// ✅ No need for QueueScheduler anymore! 
// BullMQ v5 handles stalled jobs and delayed tasks automatically.
console.log('✅ Email Queue initialized');