import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Blog } from '../models/Blog';
import { Download } from '../models/Download';
import { Facility } from '../models/Facility';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';

// GET /api/search?q=keyword - Grouped Site-Wide Search
export const globalSearch = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query || !query.trim()) {
    throw new AppError('Search query parameter "q" is required.', 400, 'VALIDATION_ERROR');
  }

  const regex = new RegExp(query.trim(), 'i');

  const [products, articles, documents, facilities] = await Promise.all([
    Product.find({
      isPublished: true,
      $or: [{ name: regex }, { shortDescription: regex }, { applications: regex }, { standards: regex }],
    })
      .select('name slug shortDescription category brand images')
      .populate('category', 'name slug')
      .limit(6),

    Blog.find({
      isPublished: true,
      $or: [{ title: regex }, { summary: regex }, { tags: regex }],
    })
      .select('title slug summary category readTimeMinutes publishedAt')
      .limit(6),

    Download.find({
      isPublic: true,
      title: regex,
    })
      .select('title category fileUrl fileSize downloadCount')
      .limit(6),

    Facility.find({
      $or: [{ unitName: regex }, { location: regex }, { capabilities: regex }],
    })
      .select('unitName location state facilityType capabilities')
      .limit(4),
  ]);

  res.status(200).json({
    success: true,
    data: {
      query: query.trim(),
      counts: {
        products: products.length,
        articles: articles.length,
        documents: documents.length,
        facilities: facilities.length,
        total: products.length + articles.length + documents.length + facilities.length,
      },
      results: {
        products,
        articles,
        documents,
        facilities,
      },
    },
  });
});
