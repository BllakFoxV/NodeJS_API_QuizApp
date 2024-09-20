import { Router } from 'express';
import { verifyToken } from '../middleware/auth.mjs';
import { getUserInfo, updateUserScore, updatePassword } from '../controller/userController.mjs';

const router = Router();

router.get('/info', verifyToken, getUserInfo);
router.post('/update-score', verifyToken, updateUserScore);
router.post('/update-password', verifyToken, updatePassword);
export default router;