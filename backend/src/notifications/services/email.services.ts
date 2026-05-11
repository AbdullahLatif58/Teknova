import nodemailer from 'nodemailer';
import { env } from '../../config/env';
import { renderTemplate } from '../../utils/handlebars';
import { EmailJob } from '../types/email';

const transporter = nodemailer.createTransport({
  host: env.SMTP.HOST,
  port: env.SMTP.PORT,
  secure: env.SMTP.ENCRYPTION === 'ssl',
  auth: {
    user: env.SMTP.USER,
    pass: env.SMTP.PASSWORD,
  },
});

export const sendEmail = async (job: EmailJob) => {
  const html = renderTemplate(job.template, job.context);

  const mailOptions = {
    from: `"${env.SMTP.FROM_NAME}" <${env.SMTP.FROM_ADDRESS}>`,
    to: job.to,
    subject: job.subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};