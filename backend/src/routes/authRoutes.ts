import { Router } from 'express';
import { login, getMe, seedDefaultAdmin } from '../controllers/authController';
import { validateLoginInput } from '../validators/authValidator';
import { protect } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authRateLimiter, validateLoginInput, login);
router.get('/me', protect, getMe);
router.post('/setup-default', seedDefaultAdmin);

export default router;
