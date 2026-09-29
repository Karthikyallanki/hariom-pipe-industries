import { Request, Response } from 'express';
import { Download } from '../models/Download';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// GET /api/downloads - Query downloadable documents
export const getAllDownloads = asyncHandler(async (req: Request, res: Response) => {
  const { category, year, search } = req.query;

  const filter: Record<string, unknown> = { isPublic: true };

  if (category) {
    filter.category = category as string;
  }

  if (year) {
    filter.financialYear = year as string;
  }

  if (search) {
    filter.title = { $regex: search as string, $options: 'i' };
  }

  const downloads = await Download.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: downloads,
  });
});

// POST /api/downloads/:id/increment - Increment download count
export const incrementDownloadCount = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const doc = await Download.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true });

  if (!doc) {
    throw new AppError('Requested document not found.', 404, 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: { downloadCount: doc.downloadCount },
  });
});

// POST /api/downloads/seed-default - Seed verified investor documents & technical catalogues
export const seedDefaultDownloads = asyncHandler(async (_req: Request, res: Response) => {
  await Download.deleteMany({});

  const defaultDownloads = [
    {
      title: 'Hariom Pipe Corporate Brochure 2026',
      category: 'Brochure',
      fileUrl: '/documents/hariom-corporate-brochure-2026.pdf',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      downloadCount: 342,
      isPublic: true,
    },
    {
      title: 'Product Technical Catalogue — Pipes & Slit Coils',
      category: 'Product Catalogue',
      fileUrl: '/documents/hariom-product-catalogue.pdf',
      fileType: 'PDF',
      fileSize: '6.8 MB',
      downloadCount: 512,
      isPublic: true,
    },
    {
      title: 'Annual Report FY 2024-25',
      category: 'Annual Report',
      financialYear: '2024-25',
      fileUrl: '/documents/hariom-annual-report-fy24-25.pdf',
      fileType: 'PDF',
      fileSize: '8.5 MB',
      downloadCount: 1240,
      isPublic: true,
    },
    {
      title: 'Annual Report FY 2023-24',
      category: 'Annual Report',
      financialYear: '2023-24',
      fileUrl: '/documents/hariom-annual-report-fy23-24.pdf',
      fileType: 'PDF',
      fileSize: '7.9 MB',
      downloadCount: 980,
      isPublic: true,
    },
    {
      title: 'Quarterly Financial Results Q3 FY 2025-26',
      category: 'Financial Disclosure',
      financialYear: '2025-26',
      fileUrl: '/documents/hariom-q3-fy26-results.pdf',
      fileType: 'PDF',
      fileSize: '2.1 MB',
      downloadCount: 650,
      isPublic: true,
    },
    {
      title: 'Bureau of Indian Standards (BIS) Certificate — IS 1239',
      category: 'Certificate',
      fileUrl: '/documents/bis-certificate-is1239.pdf',
      fileType: 'PDF',
      fileSize: '1.4 MB',
      downloadCount: 420,
      isPublic: true,
    },
    {
      title: 'Technical Datasheet — Hot-Dip GI Water Pipes',
      category: 'Technical Datasheet',
      fileUrl: '/documents/gi-pipe-technical-datasheet.pdf',
      fileType: 'PDF',
      fileSize: '1.8 MB',
      downloadCount: 290,
      isPublic: true,
    },
  ];

  await Download.insertMany(defaultDownloads);

  logger.info('[Download Seeder] Pre-populated official investor & technical documents.');

  res.status(201).json({
    success: true,
    message: 'Document center seeded successfully',
    data: defaultDownloads,
  });
});
