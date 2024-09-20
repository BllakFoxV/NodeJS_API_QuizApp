import { Router } from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.mjs';
import { ERROR_CODES } from '../constants/errorCode.mjs';
import User from '../models/User.mjs';
import Question from '../models/Question.mjs';

const router = Router();

router.get('/auth', verifyToken, isAdmin, async(req, res)=>{
    return res.status(200).json({is_admin: req.user.is_admin, fullname: req.user.fullname})
})

// Get all users
router.get('/users', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const count = req.query.count || 10;
        const page = req.query.page || 1;
        const users = await User.getAll(count, page);
        const totalUsers = await User.getCount();
        res.status(200).json({users, total_users: totalUsers});
    } catch (error) {
        next(error);
    }
});

// Set user active
router.post('/users/set-active', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { user_id, is_active } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error_code: ERROR_CODES.USER_NOT_FOUND, error: 'User not found' });
        }
        await user.setActive(is_active);
        return res.status(200).json({ok: true});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// Delete user
router.delete('/users/:user_id', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error_code: ERROR_CODES.USER_NOT_FOUND, error: 'User not found' });
        }
        await user.delete();
        res.status(200).json({data:user});
    } catch (error) {
        next(error);
    }
});

router.get('/all-questions', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const questions = await Question.getAll();
        res.status(200).json({questions});
    } catch (error) {
        next(error);
    }
});

// Get all questions
router.get('/questions', verifyToken, isAdmin, async (req, res, next) => {
    try{
        const count = req.query.count || 10;
        const page = req.query.page || 1;
        const questions = await Question.get(count, page);
        const totalQuestions = await Question.getCount();
        res.status(200).json({data:{questions, total_questions: totalQuestions}});
    } catch (error) {
        next(error);
    }
});

// Update question
router.put('/questions/:question_id', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { question_id } = req.params;
        const { text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
        const question = await Question.getById(question_id);
        if (!question) {
            return res.status(404).json({ error_code: ERROR_CODES.CANNOT_FIND_QUESTION, error: 'Question not found' });
        }
        await question.update(text, option_a, option_b, option_c, option_d, correct_answer);
        res.status(200).json({data:question});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// Delete question
router.delete('/questions/:question_id', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { question_id } = req.params;
        const question = await Question.getById(question_id);
        if (!question) {
            return res.status(404).json({ error_code: ERROR_CODES.CANNOT_FIND_QUESTION, error: 'Question not found' });
        }
        await question.delete();
        res.status(200).json({data:question});
    } catch (error) {
        next(error);
    }
});

// Create question
router.post('/questions', verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
        const exist_question = await Question.findByText(text);
        if(exist_question){
            return res.status(400).json({ error_code: ERROR_CODES.QUESTION_ALREADY_EXISTS, error: 'Question already exists' });
        }
        const question = new Question(text, option_a, option_b, option_c, option_d, correct_answer);
        await question.save();
        res.status(201).json({ok: true});
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// Error handler
router.use((err, req, res, next) => {
    res.status(500).json({ error_code: ERROR_CODES.SERVER_ERROR, error: err.message });
});

export default router;
