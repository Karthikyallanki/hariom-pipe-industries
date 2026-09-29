import { Request, Response } from 'express';
import { DealerEnquiry } from '../models/DealerEnquiry';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { emailService } from '../services/emailService';
import { io } from '../server';
import { logger } from '../utils/logger';

// Helper to generate reference ID: DLR-2026-XXXXXX
const generateDealerEnquiryId = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const count = await DealerEnquiry.countDocuments();
  const nextNum = (count + 1).toString().padStart(6, '0');
  return `DLR-${currentYear}-${nextNum}`;
};

// POST /api/dealer-enquiries - Submit Dealership Application
export const submitDealerApplication = asyncHandler(async (req: Request, res: Response) => {
  const { name, companyName, phone, email, state, city, businessType, productInterest, existingBusinessDetails, message } = req.body;

  const enquiryId = await generateDealerEnquiryId();

  const dealerEnquiry = await DealerEnquiry.create({
    enquiryId,
    name,
    companyName,
    phone,
    email,
    state,
    city,
    businessType,
    productInterest: productInterest || [],
    existingBusinessDetails: existingBusinessDetails || '',
    message,
    status: 'New',
  });

  logger.info(`[Dealer Application Received] ID: ${enquiryId} | Firm: ${companyName} (${city}, ${state})`);

  // Dispatch Email Notification (Async)
  emailService.sendDealerConfirmation(email, name, enquiryId);

  // Emit Real-Time Socket.IO Alert to Admin Dashboard
  try {
    io.emit('new_dealer_enquiry', {
      enquiryId: dealerEnquiry.enquiryId,
      applicantName: dealerEnquiry.name,
      companyName: dealerEnquiry.companyName,
      location: `${dealerEnquiry.city}, ${dealerEnquiry.state}`,
      createdAt: dealerEnquiry.createdAt,
    });
  } catch (err) {
    logger.error('[Socket.IO Emit Error]', err);
  }

  res.status(201).json({
    success: true,
    message: 'Dealership application submitted successfully',
    data: {
      enquiryId: dealerEnquiry.enquiryId,
      name: dealerEnquiry.name,
      companyName: dealerEnquiry.companyName,
      createdAt: dealerEnquiry.createdAt,
    },
  });
});

// GET /api/dealer-enquiries/admin/all - Admin fetch all dealer applications
export const getAdminDealerEnquiries = asyncHandler(async (req: Request, res: Response) => {
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
      { city: searchRegex },
      { state: searchRegex },
    ];
  }

  const enquiries = await DealerEnquiry.find(filters).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: enquiries,
  });
});

// PATCH /api/dealer-enquiries/admin/:id - Update dealer application status
export const updateDealerEnquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const enquiry = await DealerEnquiry.findById(id);
  if (!enquiry) {
    throw new AppError('Dealer application not found.', 404, 'NOT_FOUND');
  }

  if (status) {
    enquiry.status = status;
  }

  await enquiry.save();

  res.status(200).json({
    success: true,
    message: 'Dealer application status updated successfully',
    data: enquiry,
  });
});

// DELETE /api/dealer-enquiries/admin/:id - Delete dealer application
export const deleteDealerEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const enquiry = await DealerEnquiry.findByIdAndDelete(id);
  if (!enquiry) {
    throw new AppError('Dealer application not found.', 404, 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    message: 'Dealer application deleted successfully',
  });
});

