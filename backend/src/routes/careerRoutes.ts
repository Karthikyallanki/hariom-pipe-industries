import { Router } from 'express';
import { submitJobApplication } from '../controllers/careerController';
import { validateJobApplicationInput } from '../validators/careerValidator';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', apiRateLimiter, validateJobApplicationInput, submitJobApplication);

export default router;
