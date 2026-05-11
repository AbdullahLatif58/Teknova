import { sendEmail } from './src/config/mailer';

async function abTest() {
  const recipient = 'latifabdullah337@gmail.com';

  // Version A
  await sendEmail(
    recipient,
    'Signup Confirmation - Version A',
    '<h1>Welcome to Teknova! This is version A 🚀</h1>'
  );

  // Version B
  await sendEmail(
    recipient,
    'Signup Confirmation - Version B',
    '<h1>Welcome to Teknova! This is version B 🌟</h1>'
  );

  console.log('AB Test emails sent successfully!');
}

abTest().catch(console.error);