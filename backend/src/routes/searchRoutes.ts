import { Router } from 'express';
import { globalSearch } from '../controllers/searchController';
import { apiRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', apiRateLimiter, globalSearch);

export default router;
