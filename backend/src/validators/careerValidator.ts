import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export const validateJobApplicationInput = (req: Request, _res: Response, next: NextFunction) => {
  const { applicantName, email, phone, positionApplied, experienceYears, resumeUrl } = req.body;

  if (!applicantName || !applicantName.trim()) {
    return next(new AppError('Applicant full name is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!email || !email.trim()) {
    return next(new AppError('Email address is required.', 400, 'VALIDATION_ERROR'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please enter a valid email address.', 400, 'INVALID_EMAIL'));
  }

  if (!phone || !phone.trim()) {
    return next(new AppError('Phone number is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!positionApplied || !positionApplied.trim()) {
    return next(new AppError('Target position selection is required.', 400, 'VALIDATION_ERROR'));
  }

  if (experienceYears === undefined || experienceYears === null) {
    return next(new AppError('Years of experience is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!resumeUrl || !resumeUrl.trim()) {
    return next(new AppError('Resume link or document URL is required.', 400, 'VALIDATION_ERROR'));
  }

  next();
};
