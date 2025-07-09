import { generateResetToken } from "./jwt.util.js";
import sendEmail from "./sendEmail.js";
import { FRONTEND_URL } from "../config/env.js";

export const sendPasswordResetEmail = async (user) => {
  const token = generateResetToken(user._id);
  const resetURL = `${FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #ea580c;">🔐 Reset Your Password</h2>
      <p style="font-size: 16px; color: #333;">
        Hi <strong>${user.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #333;">
        We received a request to reset your password. Click the button below to set a new password:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetURL}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          🔁 Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #666;">
        This link will expire in <strong>1 hour</strong>. If you didn't request this, you can ignore this email—your password will remain unchanged.
      </p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #999;">Crust N Flame • Please do not reply to this email.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Reset your password - Crust N Flame',
    html,
  });
};