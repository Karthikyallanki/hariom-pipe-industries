import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export const validateProductInput = (req: Request, _res: Response, next: NextFunction) => {
  const { name, category, shortDescription, description } = req.body;

  if (!name || !name.trim()) {
    return next(new AppError('Product name is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!category) {
    return next(new AppError('Product category ID is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!shortDescription || !shortDescription.trim()) {
    return next(new AppError('Short product description is required.', 400, 'VALIDATION_ERROR'));
  }

  if (!description || !description.trim()) {
    return next(new AppError('Detailed product description is required.', 400, 'VALIDATION_ERROR'));
  }

  next();
};
