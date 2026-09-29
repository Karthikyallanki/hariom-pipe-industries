import { Router } from 'express';
import { getDashboardOverview, getDetailedAnalytics } from '../controllers/adminAnalyticsController';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

router.use(protect);
router.use(restrictTo('Admin', 'Editor'));

router.get('/overview', getDashboardOverview);
router.get('/detailed', getDetailedAnalytics);

export default router;
