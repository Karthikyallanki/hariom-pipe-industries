import { Router } from 'express';
import { getAllFacilities, seedDefaultFacilities } from '../controllers/facilityController';

const router = Router();

router.get('/', getAllFacilities);
router.post('/seed-default', seedDefaultFacilities);

export default router;
