import { sendEmail } from './src/notifications/services/email.services';
import { env } from './src/config/env';

async function test() {
  console.log('Testing Email Service...');
  try {
    const result = await sendEmail({
      to: 'latifabdullah337@gmail.com',
      subject: 'Test Email from Teknova',
      template: 'signup', // Assuming this template exists
      context: { name: 'Test User' }
    });
    console.log('Test result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
