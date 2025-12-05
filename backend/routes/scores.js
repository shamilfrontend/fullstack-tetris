import express from 'express';
import { submitScore, getTopScores, getMyScores } from '../controllers/scoreController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', authenticate, submitScore);
router.get('/top', getTopScores);
router.get('/my', authenticate, getMyScores);

export default router;

