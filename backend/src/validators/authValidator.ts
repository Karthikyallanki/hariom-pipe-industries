import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export const validateLoginInput = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return next(new AppError('Email address is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!password || !password.trim()) {
    return next(new AppError('Password is required.', 400, 'VALIDATION_ERROR'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400, 'INVALID_EMAIL'));
  }

  next();
};
