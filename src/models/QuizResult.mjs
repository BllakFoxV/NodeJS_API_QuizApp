import db from '../db/connection.mjs';
import { v4 as uuidv4 } from 'uuid';

class QuizResult {
    constructor(userId, score, questionsAnswered, timeTaken) {
        this.id = uuidv4();
        this.userId = userId;
        this.score = score;
        this.questionsAnswered = questionsAnswered;
        this.timeTaken = timeTaken;
    }

    static async create(userId, score, questionsAnswered, timeTaken) {
        this.userId = userId;
        this.score = score;
        this.questionsAnswered = questionsAnswered;
        this.timeTaken = timeTaken;
    }

    static async findByUserId(userId) {
        const result = await db.query('SELECT * FROM quiz_results WHERE user_id = ?', [userId]);
        return result;
    }
}

export default QuizResult;
