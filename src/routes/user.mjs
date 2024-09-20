import { Router } from 'express';
import { verifyToken } from '../middleware/auth.mjs';
import { getUserInfo } from '../controller/userController.mjs';

const router = Router();

router.get('/info', verifyToken, getUserInfo);

export default router;