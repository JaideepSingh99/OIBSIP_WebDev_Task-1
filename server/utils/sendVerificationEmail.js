import { generateEmailToken } from "./jwt.util.js";
import sendEmail from "./sendEmail.js";
import { FRONTEND_URL } from "../config/env.js";

export const sendVerificationEmail = async (user) => {
  const token = generateEmailToken(user._id);
  const verifyURL = `${FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #dc2626;">🔥 Welcome to Crust N Flame</h2>
      <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
      <p style="font-size: 16px; color: #333;">
        Thanks for signing up! Please click the button below to verify your email address and activate your account:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${verifyURL}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          ✅ Verify Email
        </a>
      </div>
      <p style="font-size: 14px; color: #666;">
        This link will expire in <strong>1 hour</strong>. If you did not request this, you can safely ignore this email.
      </p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #999;">Crust N Flame • Do not reply to this email.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Verify your email - Crust N Flame',
    html,
  });
};