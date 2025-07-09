import { Router } from 'express';
import {protect} from "../middleware/auth.middleware.js";
import {validate} from "../middleware/validate.middleware.js";
import {loginSchema, registerSchema} from "../validators/auth.validator.js";
import {
  forgotPassword,
  getUser,
  login,
  logout,
  register,
  resendVerificationEmail,
  resetPassword, updateUser,
  verifyEmail
} from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/resend-verification-email', resendVerificationEmail);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/logout', protect, logout);
authRouter.get('/me', protect, getUser);
authRouter.patch('/update', protect, updateUser);

export default authRouter;