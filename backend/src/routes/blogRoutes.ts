import { Router } from 'express';
import { getAllBlogs, getBlogBySlug, seedDefaultBlogs } from '../controllers/blogController';

const router = Router();

router.get('/', getAllBlogs);
router.post('/seed-default', seedDefaultBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
