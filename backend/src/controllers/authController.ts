import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/env';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';
import { auditService } from '../services/auditService';
import { logger } from '../utils/logger';

const signToken = (userId: string, email: string, role: 'Admin' | 'Editor'): string => {
  return jwt.sign({ userId, email, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials or account deactivated.', 401, 'INVALID_CREDENTIALS');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS');
  }

  user.lastLogin = new Date();
  await user.save();

  const userIdStr = String(user._id);
  const token = signToken(userIdStr, user.email, user.role);

  await auditService.logAction({
    userId: userIdStr,
    userName: user.name,
    action: 'ADMIN_LOGIN',
    entityType: 'User',
    entityId: userIdStr,
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    },
  });
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User session not found.', 401, 'UNAUTHORIZED');
  }

  const user = await User.findById(req.user.userId).select('-password');
  if (!user) {
    throw new AppError('User profile not found.', 404, 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

export const seedDefaultAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const existingAdmin = await User.findOne({ role: 'Admin' });

  if (existingAdmin) {
    return res.status(200).json({
      success: true,
      message: 'Admin account already exists.',
      data: { email: existingAdmin.email },
    });
  }

  const defaultAdmin = await User.create({
    name: 'Hariom System Admin',
    email: 'admin@hariompipes.com',
    password: 'HariomAdmin2026!Secure',
    role: 'Admin',
    isActive: true,
  });

  logger.info(`[Default Admin Initialized] Email: ${defaultAdmin.email}`);

  res.status(201).json({
    success: true,
    message: 'Default admin account initialized successfully.',
    data: {
      email: defaultAdmin.email,
      role: defaultAdmin.role,
    },
  });
});
