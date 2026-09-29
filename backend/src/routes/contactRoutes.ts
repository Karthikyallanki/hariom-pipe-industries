import { Router } from 'express';
import { submitContactMessage } from '../controllers/contactController';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', apiRateLimiter, submitContactMessage);

export default router;
