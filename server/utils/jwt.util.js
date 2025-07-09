import jwt from 'jsonwebtoken';
import {EMAIL_SECRET, RESET_SECRET} from "../config/env.js";

export const generateEmailToken = (userId) => {
  return jwt.sign(
    { id: userId },
    EMAIL_SECRET,
    { expiresIn: '1h' }
  );
};

export const generateResetToken = (userId) => {
  return jwt.sign(
    { id: userId },
    RESET_SECRET,
    { expiresIn: '15m' }
  );
};