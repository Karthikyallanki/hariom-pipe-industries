import { Router } from 'express';
import {
  submitQuoteRequest,
  getAdminEnquiries,
  getAdminEnquiryById,
  updateEnquiryStatusAndNotes,
  deleteEnquiry,
} from '../controllers/enquiryController';
import { validateQuoteInput } from '../validators/enquiryValidator';
import { enquiryRateLimiter } from '../middleware/rateLimiter';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// Public submission route
router.post('/', enquiryRateLimiter, validateQuoteInput, submitQuoteRequest);

// Protected Admin Management Routes
router.get('/admin/all', protect, restrictTo('Admin', 'Editor'), getAdminEnquiries);
router.get('/admin/:id', protect, restrictTo('Admin', 'Editor'), getAdminEnquiryById);
router.patch('/admin/:id', protect, restrictTo('Admin', 'Editor'), updateEnquiryStatusAndNotes);
router.delete('/admin/:id', protect, restrictTo('Admin'), deleteEnquiry);

export default router;
