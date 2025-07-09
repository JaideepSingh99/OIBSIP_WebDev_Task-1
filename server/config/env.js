import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development' }.local`});

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  EMAIL_SECRET,
  RESET_SECRET,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FRONTEND_URL,
  FROM_NAME,
  FROM_EMAIL,
  ADMIN_EMAIL,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;