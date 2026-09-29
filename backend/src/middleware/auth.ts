import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AuthenticatedRequest, IUserPayload } from '../types';
import { AppError } from './errorHandler';

export const protect = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized. No token provided.', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as IUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError('Token verification failed or expired.', 401, 'INVALID_TOKEN'));
  }
};

export const restrictTo = (...roles: Array<'Admin' | 'Editor'>) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Permission denied. Insufficient privileges.', 403, 'FORBIDDEN'));
    }
    next();
  };
};
