import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { emailService } from '../services/emailService';
import { io } from '../server';
import { logger } from '../utils/logger';

// Helper to generate reference ID: HPIL-2026-XXXXXX
const generateEnquiryId = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const count = await Enquiry.countDocuments();
  const nextNum = (count + 1).toString().padStart(6, '0');
  return `HPIL-${currentYear}-${nextNum}`;
};

// POST /api/enquiries - Submit Customer Quotation Request
export const submitQuoteRequest = asyncHandler(async (req: Request, res: Response) => {
  const { name, companyName, email, phone, city, state, productId, productName, quantity, requirementType, message, attachmentUrl } = req.body;

  const enquiryId = await generateEnquiryId();

  const enquiry = await Enquiry.create({
    enquiryId,
    name,
    companyName,
    email,
    phone,
    city,
    state,
    productId: productId || undefined,
    productName: productName || undefined,
    quantity: quantity || undefined,
    requirementType: requirementType || 'Quotation Request',
    message,
    attachmentUrl: attachmentUrl || undefined,
    status: 'New',
  });

  logger.info(`[Quote Request Received] ID: ${enquiryId} | Customer: ${name} (${companyName})`);

  // Dispatch Email Notification (Async)
  emailService.sendQuoteConfirmation(email, name, enquiryId);

  // Emit Real-Time Socket.IO Alert to Admin Dashboard
  try {
    io.emit('new_quote_enquiry', {
      enquiryId: enquiry.enquiryId,
      customerName: enquiry.name,
      companyName: enquiry.companyName,
      productName: enquiry.productName || 'General Quote',
      createdAt: enquiry.createdAt,
    });
  } catch (err) {
    logger.error('[Socket.IO Emit Error]', err);
  }

  res.status(201).json({
    success: true,
    message: 'Quotation request submitted successfully',
    data: {
      enquiryId: enquiry.enquiryId,
      name: enquiry.name,
      companyName: enquiry.companyName,
      createdAt: enquiry.createdAt,
    },
  });
});

// GET /api/enquiries/admin/all - Get all quote enquiries for Admin with filtering
export const getAdminEnquiries = asyncHandler(async (req: Request, res: Response) => {
  const { status, search } = req.query;

  const filters: Record<string, unknown> = {};

  if (status && status !== 'ALL') {
    filters.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filters.$or = [
      { enquiryId: searchRegex },
      { name: searchRegex },
      { companyName: searchRegex },
      { email: searchRegex },
      { city: searchRegex },
      { productName: searchRegex },
    ];
  }

  const enquiries = await Enquiry.find(filters).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: enquiries,
  });
});

// GET /api/enquiries/admin/:id - Get single enquiry details
export const getAdminEnquiryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    throw new AppError('Quote enquiry not found.', 404, 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: enquiry,
  });
});

// PATCH /api/enquiries/admin/:id - Update status and append admin notes
export const updateEnquiryStatusAndNotes = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, noteText } = req.body;

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    throw new AppError('Quote enquiry not found.', 404, 'NOT_FOUND');
  }

  if (status) {
    enquiry.status = status;
  }

  if (noteText && noteText.trim()) {
    const authorName = req.user?.email || 'Admin';
    enquiry.notes.push({
      author: authorName,
      text: noteText.trim(),
      createdAt: new Date(),
    });
  }

  await enquiry.save();

  logger.info(`[Admin] Quote Enquiry ${enquiry.enquiryId} updated to status: ${enquiry.status}`);

  res.status(200).json({
    success: true,
    message: 'Quote enquiry updated successfully',
    data: enquiry,
  });
});

// DELETE /api/enquiries/admin/:id - Delete quote enquiry
export const deleteEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const enquiry = await Enquiry.findByIdAndDelete(id);
  if (!enquiry) {
    throw new AppError('Quote enquiry not found.', 404, 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    message: 'Quote enquiry deleted successfully',
  });
});

