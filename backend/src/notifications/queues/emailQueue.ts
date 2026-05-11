import { emailQueue } from '../../config/bullmq';
import { EmailJob } from '../types/email';

export const addEmailToQueue = async (job: EmailJob) => {
  console.log(`[EmailQueue] Adding job to queue: ${job.template} to ${job.to}`);
  await emailQueue.add(job.template, job, {
    attempts: 3,      
    backoff: {
      type: 'exponential',
      delay: 5000,    
    },
  });
};