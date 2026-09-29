import { Router } from 'express';
import {
  getAllProducts,
  getProductBySlug,
  getCategories,
  compareProducts,
  findProductByRule,
  createProduct,
  updateProduct,
  deleteProduct,
  seedDefaultProducts,
  getAdminProducts,
} from '../controllers/productController';
import { validateProductInput } from '../validators/productValidator';
import { protect, restrictTo } from '../middleware/auth';

const router = Router();

// Public Routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/compare', compareProducts);
router.get('/finder', findProductByRule);
router.post('/seed-default', seedDefaultProducts);

// Protected Admin Routes
router.get('/admin/all', protect, restrictTo('Admin', 'Editor'), getAdminProducts);
router.post('/admin', protect, restrictTo('Admin', 'Editor'), validateProductInput, createProduct);
router.patch('/admin/:id', protect, restrictTo('Admin', 'Editor'), updateProduct);
router.delete('/admin/:id', protect, restrictTo('Admin'), deleteProduct);

// Dynamic public route
router.get('/:slug', getProductBySlug);

export default router;
