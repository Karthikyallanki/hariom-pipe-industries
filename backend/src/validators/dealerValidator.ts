import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export const validateDealerInput = (req: Request, _res: Response, next: NextFunction) => {
  const { name, companyName, phone, email, state, city, businessType, message } = req.body;

  if (!name || !name.trim()) {
    return next(new AppError('Applicant name is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!companyName || !companyName.trim()) {
    return next(new AppError('Business / Firm name is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!phone || !phone.trim()) {
    return next(new AppError('Contact phone number is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!email || !email.trim()) {
    return next(new AppError('Email address is required.', 400, 'VALIDATION_ERROR'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400, 'INVALID_EMAIL'));
  }

  if (!state || !state.trim()) {
    return next(new AppError('State is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!city || !city.trim()) {
    return next(new AppError('City is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!businessType || !businessType.trim()) {
    return next(new AppError('Business type selection is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!message || !message.trim()) {
    return next(new AppError('Business details message is required.', 400, 'VALIDATION_ERROR'));
  }

  next();
};
