import Question from '../models/Question.mjs';
import { ERROR_CODES } from '../constants/errorCode.mjs';

export const getQuestions = async (req, res) => {
    const { count } = req.query;
    const questions = await Question.get(count);
    if (questions) {
        res.status(200).json({ data: { questions } });
    } else {
        res.status(404).json({ error_code: ERROR_CODES.NO_QUESTION_FOUND, error: 'No question found' });
    }
};

export const getQuiz = async (req, res) => {
    const question = await Question.getRandom();
    if (question) {
        res.status(200).json({ data: { question } });
    } else {
        res.status(404).json({ error_code: ERROR_CODES.NO_QUESTION_FOUND, error: 'No question found' });
    }
};

export const validateQuiz = async (req, res) => {
    const { question_id, answer } = req.body;
    const question = await Question.getById(question_id);
    if (question) {
        if (question) {
            res.status(200).json({ data: { 
                is_correct: question.isCorrect(answer), 
                correct_answer: question.correctAnswer,
                user_answer: answer
            }});
        } else {
            res.status(400).json({ error_code: ERROR_CODES.CANNOT_FIND_QUESTION, error: 'can\'t find question' });
        }
    }
};