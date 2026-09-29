import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import facilityRoutes from './facilityRoutes';
import enquiryRoutes from './enquiryRoutes';
import dealerRoutes from './dealerRoutes';
import contactRoutes from './contactRoutes';
import careerRoutes from './careerRoutes';
import blogRoutes from './blogRoutes';
import downloadRoutes from './downloadRoutes';
import searchRoutes from './searchRoutes';
import adminAnalyticsRoutes from './adminAnalyticsRoutes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OPERATIONAL',
      service: 'Hariom Pipe Industries Enterprise REST API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
});

router.use('/admin/analytics', adminAnalyticsRoutes);
router.use('/admin', authRoutes);
router.use('/products', productRoutes);
router.use('/facilities', facilityRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/dealer-enquiries', dealerRoutes);
router.use('/contact', contactRoutes);
router.use('/job-applications', careerRoutes);
router.use('/blogs', blogRoutes);
router.use('/downloads', downloadRoutes);
router.use('/search', searchRoutes);

export default router;
