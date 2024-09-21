import db from '../db/connection.mjs';
import { v4 as uuidv4 } from 'uuid';

class QuizResult {
    constructor(userId,  total_questions, score=0, time_taken=0, created_at=null, id=null) {
        this.id = id || uuidv4();
        this.userId = userId;
        this.score = score;
        this.total_questions = total_questions;
        this.created_at = created_at ? new Date(created_at) : new Date();
    }

    static fromJson(json) {
        return new QuizResult(json.user_id,
            json.total_questions,
             json.score,
             json.time_taken,
             json.created_at,
             json.id);
    }

    static async findByUserId(userId) {
        const result = await db.query('SELECT * FROM quiz_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 5', [userId]);
        return result;
    }

    static async findById(id) {
        const [result] = await db.query('SELECT * FROM quiz_results WHERE id = ? LIMIT 1', [id]);
        return result ? QuizResult.fromJson(result) : null;
    }

    async save() {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insert new quiz result
            await connection.query('INSERT INTO quiz_results (id, user_id, total_questions, score) VALUES (?, ?, ?, ?)',
                [this.id, this.userId, this.total_questions, this.score]);

            // Delete old results, keeping only the latest 5
            await connection.query(`
                DELETE FROM quiz_results 
                WHERE user_id = ? 
                AND id NOT IN (
                    SELECT id FROM (
                        SELECT id 
                        FROM quiz_results 
                        WHERE user_id = ? 
                        ORDER BY created_at DESC 
                        LIMIT 5
                    ) as latest_results
                )
            `, [this.userId, this.userId]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.error('Error saving quiz result:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateScore(score) {
        if (score > this.total_questions) {
            score = 0;
        }
        const result = await db.query(
            'UPDATE quiz_results SET score = ?, time_taken = TIMESTAMPDIFF(SECOND, created_at, NOW()) WHERE id = ?',
            [score, this.id]
        );
        if (result.affectedRows > 0) {
            return true;
        }
        return false;
    }
}

export default QuizResult;
