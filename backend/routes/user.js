import express from 'express';

import { getProfile, changePassword } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
