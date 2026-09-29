import { Router } from 'express';
import { getAllDownloads, incrementDownloadCount, seedDefaultDownloads } from '../controllers/downloadController';

const router = Router();

router.get('/', getAllDownloads);
router.post('/seed-default', seedDefaultDownloads);
router.post('/:id/increment', incrementDownloadCount);

export default router;
