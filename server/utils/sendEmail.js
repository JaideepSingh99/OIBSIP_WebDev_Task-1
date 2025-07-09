import nodemailer from 'nodemailer';
import {FROM_EMAIL, FROM_NAME, SMTP_PASS, SMTP_PORT, SMTP_USER} from "../config/env.js";

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: Number(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
  });

  const mailOptions = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
  return info;
};

export default sendEmail;