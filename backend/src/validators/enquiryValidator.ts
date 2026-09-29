import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export const validateQuoteInput = (req: Request, _res: Response, next: NextFunction) => {
  const { name, companyName, email, phone, city, state, message } = req.body;

  if (!name || !name.trim()) {
    return next(new AppError('Full name is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!companyName || !companyName.trim()) {
    return next(new AppError('Company / Enterprise name is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!email || !email.trim()) {
    return next(new AppError('Email address is required.', 400, 'VALIDATION_ERROR'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please enter a valid email address.', 400, 'INVALID_EMAIL'));
  }

  if (!phone || !phone.trim()) {
    return next(new AppError('Contact phone number is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!city || !city.trim()) {
    return next(new AppError('City is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!state || !state.trim()) {
    return next(new AppError('State is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!message || !message.trim()) {
    return next(new AppError('Quotation requirement details are required.', 400, 'VALIDATION_ERROR'));
  }

  next();
};
