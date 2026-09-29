import { Response } from 'express';
import { Enquiry } from '../models/Enquiry';
import { DealerEnquiry } from '../models/DealerEnquiry';
import { ContactMessage } from '../models/ContactMessage';
import { JobApplication } from '../models/JobApplication';
import { Product } from '../models/Product';
import { Download } from '../models/Download';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthenticatedRequest } from '../types';

// GET /api/admin/analytics/overview - Admin Dashboard High-Level KPI Metrics
export const getDashboardOverview = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [
    totalEnquiries,
    totalDealerEnquiries,
    totalContactMessages,
    totalJobApplications,
    totalProducts,
    recentEnquiries,
    recentDealerEnquiries,
    enquiriesByStatus,
  ] = await Promise.all([
    Enquiry.countDocuments(),
    DealerEnquiry.countDocuments(),
    ContactMessage.countDocuments(),
    JobApplication.countDocuments(),
    Product.countDocuments(),

    Enquiry.find().sort({ createdAt: -1 }).limit(5).select('enquiryId name companyName productName status createdAt'),

    DealerEnquiry.find().sort({ createdAt: -1 }).limit(5).select('enquiryId name companyName city state status createdAt'),

    Enquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      kpi: {
        totalEnquiries,
        totalDealerEnquiries,
        totalContactMessages,
        totalJobApplications,
        totalProducts,
      },
      recentEnquiries,
      recentDealerEnquiries,
      enquiriesByStatus: enquiriesByStatus.reduce((acc: Record<string, number>, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    },
  });
});

// GET /api/admin/analytics/detailed - MongoDB Aggregation Pipeline Intelligence
export const getDetailedAnalytics = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const [
    topViewedProducts,
    enquiriesByState,
    dealerApplicationsByState,
    topDownloads,
    monthlyEnquiryTrends,
  ] = await Promise.all([
    // Top Viewed Products Ranking
    Product.find()
      .sort({ viewsCount: -1 })
      .limit(6)
      .select('name slug viewsCount brand category')
      .populate('category', 'name'),

    // Geographic Demand Heatmap (RFQs by State)
    Enquiry.aggregate([
      {
        $group: {
          _id: '$state',
          totalRFQs: { $sum: 1 },
        },
      },
      { $sort: { totalRFQs: -1 } },
      { $limit: 8 },
    ]),

    // Dealer Network Expansion by State
    DealerEnquiry.aggregate([
      {
        $group: {
          _id: '$state',
          totalApplicants: { $sum: 1 },
        },
      },
      { $sort: { totalApplicants: -1 } },
      { $limit: 8 },
    ]),

    // Investor & Technical Document Download Popularity
    Download.find()
      .sort({ downloadCount: -1 })
      .limit(5)
      .select('title category fileType downloadCount fileSize'),

    // Aggregated Monthly Submission Volumes
    Enquiry.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      topViewedProducts,
      enquiriesByState,
      dealerApplicationsByState,
      topDownloads,
      monthlyEnquiryTrends: monthlyEnquiryTrends.map((t) => ({
        period: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
        count: t.count,
      })),
    },
  });
});
