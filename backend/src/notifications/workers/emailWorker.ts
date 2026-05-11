import { Worker } from 'bullmq';
import { emailQueueName } from '../../config/bullmq';
import { env } from '../../config/env';
import { sendEmail } from '../services/email.services';
import { createClient } from 'redis';


const connectionOptions = {
  host: env.REDIS.HOST,
  port: env.REDIS.PORT,
  password: env.REDIS.PASSWORD || undefined,
};


const worker = new Worker(
  emailQueueName,
  async (job) => {
    console.log(`[EmailWorker] Processing job ${job.id} of type ${job.name}`);
    await sendEmail(job.data);
  },
  { connection: connectionOptions }
);

console.log(`✅ Email Worker started for queue: ${emailQueueName}`);

worker.on('completed', (job) =>
  console.log(`[EmailWorker] SUCCESS: Job ${job.id} completed`)
);
worker.on('failed', (job, err) => {
  console.error(`[EmailWorker] FAILED: Job ${job?.id} failed with error:`, err);
});

worker.on('error', (err) => {
  console.error(`[EmailWorker] CRITICAL ERROR:`, err);
});