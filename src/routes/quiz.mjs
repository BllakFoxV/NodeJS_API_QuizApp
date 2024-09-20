import { Router } from 'express';
import { verifyToken, isActive } from '../middleware/auth.mjs';
import { getQuestions, getQuiz, validateQuiz } from '../controller/quizController.mjs';

const router = Router();

router.get('/', verifyToken, isActive, getQuiz);
router.get('/get-package', verifyToken, isActive, getQuestions);
router.post('/', verifyToken, isActive, validateQuiz);


export default router;