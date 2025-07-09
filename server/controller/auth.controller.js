import bcrypt from 'bcryptjs';
import {ApiError, asyncHandler} from "../middleware/error.middleware.js";
import User from "../models/user.model.js";
import {sendVerificationEmail} from "../utils/sendVerificationEmail.js";
import {sanitizeUser} from "../utils/user.util.js";
import jwt from "jsonwebtoken";
import {EMAIL_SECRET, JWT_SECRET, RESET_SECRET} from "../config/env.js";
import {sendPasswordResetEmail} from "../utils/sendPasswordResetEmail.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  const existingUser = await User.findOne({ email });
  if(existingUser) {
    throw new ApiError(400, 'User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address: {
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country
    }
  });

  await sendVerificationEmail(user);

  res.status(201).json({
    success: true,
    user: sanitizeUser(user.toObject())
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if(!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if(!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if(!user.isEmailVerified) {
    throw new ApiError(401, 'Please verify your email address');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: sanitizeUser(user.toObject())
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if(!token) {
    throw new ApiError(400, 'Token is missing');
  }

  let payload;
  try {
    payload = jwt.verify(token, EMAIL_SECRET);
  } catch (error) {
    throw new ApiError(400, 'Invalid or expired token');
  }

  const user = await User.findById(payload.id);
  if(!user) {
    throw new ApiError(404, 'User not found');
  }
  if(user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: 'Email already verified'
    });
  }

  user.isEmailVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

export const resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if(!email) {
    throw new ApiError(400, 'Email is missing');
  }

  const user = await User.findOne({ email });
  if(!user) {
    throw new ApiError(404, 'User not found');
  }
  if(user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email already verified'
    });
  }

  await sendVerificationEmail(user);

  res.status(200).json({
    success: true,
    message: 'Verification email sent successfully'
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if(!user) {
    throw new ApiError(404, 'User not found');
  }

  await sendPasswordResetEmail(user);

  res.status(200).json({
    success: true,
    message: 'Reset password email sent successfully'
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  if(!newPassword || newPassword.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  try {
    const decode = jwt.verify(token, RESET_SECRET);
    const user = await User.findById(decode.id)
    if(!user) {
      throw new ApiError(404, 'User not found');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    throw new ApiError(400, 'Invalid or expired token');
  }
});

export const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if(!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    user: sanitizeUser(user.toObject())
  });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const updatedData = req.body;
  const disallowedFields = ['_id', 'email', 'password', 'role', 'isVerified'];
  const user = await User.findById(req.user._id);
  if(!user) throw new ApiError(404, 'User not found');

  for(let field of disallowedFields) {
    if(field in updatedData) {
      delete updatedData[field];
    }
  }

  Object.assign(user, updatedData);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: sanitizeUser(user.toObject())
  });

});