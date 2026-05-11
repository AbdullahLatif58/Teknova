import { emailQueue } from '../../config/bullmq';
import { EmailJob } from '../types/email';

export const addEmailToQueue = async (job: EmailJob) => {
  await emailQueue.add(job.template, job, {
    attempts: 3,      
    backoff: {
      type: 'exponential',
      delay: 5000,    
    },
  });
};