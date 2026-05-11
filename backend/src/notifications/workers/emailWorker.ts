import { Worker } from 'bullmq';
import { emailQueueName } from '../../config/bullmq';
import { env } from '../../config/env';
import { sendEmail } from '../services/email.services';
import { createClient } from 'redis';


const connectionOptions = {
  socket: {
    host: env.REDIS.HOST,
    port: env.REDIS.PORT,
  },
  password: env.REDIS.PASSWORD || undefined,
};


const worker = new Worker(
  emailQueueName,
  async (job) => {
    await sendEmail(job.data);
  },
  { connection: connectionOptions }
);

worker.on('completed', (job) =>
  console.log(` Email job completed: ${job.id}`)
);
worker.on('failed', (job, err) =>
  console.log(`Email job failed: ${job?.id}`, err)
);