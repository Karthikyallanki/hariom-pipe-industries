import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { io } from '../server';
import { logger } from '../utils/logger';

// POST /api/contact - Submit Corporate Contact Message
export const submitContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, subject, department, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    throw new AppError('All required contact fields must be provided.', 400, 'VALIDATION_ERROR');
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    department: department || 'General Inquiries',
    message,
  });

  logger.info(`[Contact Message Received] From: ${name} (${email}) | Department: ${department}`);

  try {
    io.emit('new_contact_message', {
      id: contactMessage._id,
      name: contactMessage.name,
      email: contactMessage.email,
      department: contactMessage.department,
      subject: contactMessage.subject,
      createdAt: (contactMessage as any).createdAt,
    });
  } catch (err) {
    logger.error('[Socket.IO Emit Error]', err);
  }

  res.status(201).json({
    success: true,
    message: 'Corporate inquiry submitted successfully. Our team will get back to you shortly.',
    data: { id: contactMessage._id },
  });
});
