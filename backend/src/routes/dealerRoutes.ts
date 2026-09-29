import { Router } from 'express';
import {
  submitDealerApplication,
  getAdminDealerEnquiries,
  updateDealerEnquiryStatus,
  deleteDealerEnquiry,
} from '../controllers/dealerController';
import { validateDealerInput } from '../validators/dealerValidator';
import { enquiryRateLimiter } from '../middleware/rateLimiter';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// Public submission route
router.post('/', enquiryRateLimiter, validateDealerInput, submitDealerApplication);

// Protected Admin Management Routes
router.get('/admin/all', protect, restrictTo('Admin', 'Editor'), getAdminDealerEnquiries);
router.patch('/admin/:id', protect, restrictTo('Admin', 'Editor'), updateDealerEnquiryStatus);
router.delete('/admin/:id', protect, restrictTo('Admin'), deleteDealerEnquiry);

export default router;
