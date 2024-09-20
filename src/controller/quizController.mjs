import Question from '../models/Question.mjs';
import { ERROR_CODES } from '../constants/errorCode.mjs';
import QuizResult from '../models/QuizResult.mjs';

export const getQuestions = async (req, res) => {
    const { count } = req.query;
    if(isNaN(count)){
        res.status(400).json({ error_code: ERROR_CODES.INVALID_INPUT, error: 'Invalid input' });
    }
    const questions = await Question.get(count);
    const quiz_result = new QuizResult(req.user.id, questions.length);
    try{
        await quiz_result.save();
    }catch(error){
        console.log(error);
    }
    if (questions) {
        res.status(200).json({ questions, result_id: quiz_result.id });
    } else {
        res.status(404).json({ error_code: ERROR_CODES.NO_QUESTION_FOUND, error: 'No question found' });
    }
};

export const getQuiz = async (req, res) => {
    const question = await Question.getRandom();
    if (question) {
        res.status(200).json({ question });
    } else {
        res.status(404).json({ error_code: ERROR_CODES.NO_QUESTION_FOUND, error: 'No question found' });
    }
};

export const validateQuiz = async (req, res) => {
    const { question_id, answer } = req.body;
    const question = await Question.getById(question_id);
    if (question) {
        if (question) {
            res.status(200).json({ is_correct: question.isCorrect(answer), 
                correct_answer: question.correctAnswer,
                user_answer: answer
            });
        } else {
            res.status(400).json({ error_code: ERROR_CODES.CANNOT_FIND_QUESTION, error: 'can\'t find question' });
        }
    }
};