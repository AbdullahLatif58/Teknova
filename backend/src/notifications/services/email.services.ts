import nodemailer from 'nodemailer';
import { env } from '../../config/env';
import { renderTemplate } from '../../utils/handlebars';
import { EmailJob } from '../types/email';

const transporter = nodemailer.createTransport({
  host: env.SMTP.HOST,
  port: env.SMTP.PORT,
  secure: env.SMTP.PORT === 465, // true for 465, false for other ports (like 587)
  auth: {
    user: env.SMTP.USER,
    pass: env.SMTP.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async (job: EmailJob) => {
  try {
    console.log(`[EmailService] CONFIG: host=${env.SMTP.HOST}, port=${env.SMTP.PORT}, user=${env.SMTP.USER}, secure=${env.SMTP.PORT === 465}`);
    console.log(`[EmailService] Attempting to send email: to=${job.to}, subject=${job.subject}, template=${job.template}`);
    const html = renderTemplate(job.template, job.context);

    const mailOptions = {
      from: `"${env.SMTP.FROM_NAME}" <${env.SMTP.FROM_ADDRESS}>`,
      to: job.to,
      subject: job.subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent successfully: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error(`[EmailService] ERROR sending email:`, error);
    throw error;
  }
};