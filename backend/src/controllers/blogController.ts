import { Request, Response } from 'express';
import { Blog } from '../models/Blog';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../types';
import { logger } from '../utils/logger';

// GET /api/blogs - Query blogs with pagination & filters
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 9;
  const skip = (page - 1) * limit;

  const { category, tag, search } = req.query;

  const filter: Record<string, unknown> = { isPublished: true };

  if (category) {
    filter.category = category as string;
  }

  if (tag) {
    filter.tags = { $in: [tag as string] };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { summary: { $regex: search as string, $options: 'i' } },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: blogs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

// GET /api/blogs/:slug - Single article detail
export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug, isPublished: true });

  if (!blog) {
    throw new AppError('Requested industry article was not found.', 404, 'NOT_FOUND');
  }

  const relatedArticles = await Blog.find({
    category: blog.category,
    _id: { $ne: blog._id },
    isPublished: true,
  })
    .limit(3)
    .select('title slug summary coverImage category readTimeMinutes publishedAt');

  res.status(200).json({
    success: true,
    data: {
      blog,
      relatedArticles,
    },
  });
});

// POST /api/blogs/seed-default - Seed verified articles
export const seedDefaultBlogs = asyncHandler(async (_req: Request, res: Response) => {
  await Blog.deleteMany({});

  const defaultBlogs = [
    {
      title: 'Role of Galvanized Iron (GI) Pipes in Infrastructure & Irrigation',
      slug: 'role-of-gi-pipes-in-infrastructure-irrigation',
      summary: 'An in-depth technical analysis on why Hot-Dip Galvanized Iron pipes offer long-term corrosion prevention for water networks.',
      content: `Galvanized Iron (GI) pipes have long been the backbone of municipal water distribution, fire-fighting systems, and agricultural irrigation networks across India.

### Corrosion Prevention via Hot-Dip Zinc Coating
When Mild Steel (MS) pipes undergo hot-dip galvanizing, a metallurgically bonded layer of zinc is applied across both internal and external walls. The zinc coating acts as a sacrificial anode, corroding in place of the base steel even if surface scratches occur.

### BIS Standards Compliance
Hariom GI Pipes adhere strictly to IS 1239 (Part-1) specifications across Light, Medium, and Heavy classes. Every length is hydrostatic pressure tested up to 5 MPa to guarantee zero leakage under high hydraulic head pressure.`,
      author: 'Hariom Metallurgical Team',
      category: 'Technical Insights',
      tags: ['GI Pipes', 'Galvanizing', 'Irrigation', 'IS 1239'],
      readTimeMinutes: 6,
      isPublished: true,
      publishedAt: new Date('2026-08-15'),
    },
    {
      title: 'Understanding Steel Billet Quality in Integrated Re-Rolling Mills',
      slug: 'understanding-steel-billet-quality-rerolling',
      summary: 'How continuous casting technology (CCM) at Hariom Mahabubnagar plant eliminates internal piping and ensures uniform carbon distribution.',
      content: `Primary steel billets serve as the raw feedstock for TMT bars, structural angles, and channel sections. 

### Integrated Induction Furnace & CCM Process
By utilizing virgin sponge iron produced in captive rotary kilns, Hariom maintains precise chemical control over Liquid Steel. Continuous casting machines (CCM) cool molten steel uniformly, preventing central porosity and internal cracking.`,
      author: 'Hariom Technical Directorate',
      category: 'Manufacturing Technology',
      tags: ['MS Billets', 'Steel Making', 'Induction Furnace', 'IS 2830'],
      readTimeMinutes: 5,
      isPublished: true,
      publishedAt: new Date('2026-09-01'),
    },
    {
      title: 'Solar Module Racking: Selecting High-Yield Structural Tubes',
      slug: 'solar-module-racking-structural-tubes',
      summary: 'Why Pre-Galvanized (GP) and Hot-Rolled (HR) YST 310 structural hollow sections are the preferred choice for utility-scale solar farms.',
      content: `Utility-scale solar power plants require structural mounting frames capable of resisting high wind loads and atmospheric weathering for 25+ years.

### YST 310 Yield Strength Advantage
Hariom HR & GP Hollow Sections (conforming to IS 4923) provide superior strength-to-weight ratios compared to open channel sections, reducing overall steel tonnage while meeting structural deflection criteria.`,
      author: 'Hariom Solar Solutions Group',
      category: 'Industry Insights',
      tags: ['Solar Structures', 'HR Pipes', 'GP Tubes', 'IS 4923'],
      readTimeMinutes: 7,
      isPublished: true,
      publishedAt: new Date('2026-09-20'),
    },
  ];

  await Blog.insertMany(defaultBlogs);

  logger.info('[Blog Seeder] Pre-populated official Hariom industry insights.');

  res.status(201).json({
    success: true,
    message: 'Official industry insights seeded successfully',
    data: defaultBlogs,
  });
});
