import nodemailer from 'nodemailer';
import config from '../config';

export const sendMail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: config.NODE_ENV === 'production' ? true : false,
    auth: {
      user: config.email,
      pass: config.password,
    },
  });

  const mailOptions = {
    from: config.email,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}
