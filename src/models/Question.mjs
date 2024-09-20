import { v4 as uuidv4 } from 'uuid';
import db from '../db/connection.mjs';

class Question {
    constructor(text, option_a, option_b, option_c, option_d, correctAnswer, id = null) {
        this.id = id || uuidv4();
        this.text = text;
        this.option_a = option_a;
        this.option_b = option_b;
        this.option_c = option_c;
        this.option_d = option_d;
        this.options = [this.option_a,this.option_b,this.option_c,this.option_d]
        this.correct_answer = correctAnswer;
    }
    static async getCount() {
        const [results] = await db.query(`SELECT COUNT(*) FROM questions`);
        return results ? parseInt(results['COUNT(*)']) : 0;
    }

    static async getAll() {
        const results = await db.query(`SELECT * FROM questions`);
        return results.map(result => this.fromJSON(result));
    }

    static async get(count = 10) {
        const results = await db.query(`SELECT * FROM questions ORDER BY RAND() LIMIT ?`, [parseInt(count)]);
        return results.map(result => this.fromJSON(result));
    }
    static async getRandom() {
        const [results] = await db.query('SELECT * FROM questions ORDER BY RAND() LIMIT 1');
        if (!results) {
            return null;
        }
        return new Question().fromJSON(results);
    }

    static async getById(id) {
        const [results] = await db.query('SELECT * FROM questions WHERE id = ? LIMIT 1', [id]);
        if (!results) {
            return null;
        }
        return this.fromJSON(results);
    }

    isCorrect(answer) {
        const chars = ['A', 'B', 'C', 'D'];
        const options = [this.option_a, this.option_b, this.option_c, this.option_d];
        const indexCorrectAnswer = chars.indexOf(this.correct_answer);
        const indexAnswer = options.indexOf(answer) || -1;
        return indexAnswer === indexCorrectAnswer;
    }

    static fromJSON(json) {
        if (json) {
            return new Question(json?.text, json?.option_a, json?.option_b, json?.option_c, json?.option_d, json?.correct_answer, json?.id);
        }
        return null;
    }

    static async findByText(text) {
        try{
            const [results] = await db.query('SELECT * FROM questions WHERE text = ? LIMIT 1', [text]);
            if (!results) {
                return null;
            }
            return this.fromJSON(results);
        }catch(error){
            console.log(error);
            return null;
        }
    }

    toJSON() {
        return {
            id: this.id,
            text: this.text,
            option_a: this.option_a,
            option_b: this.option_b,
            option_c: this.option_c,
            option_d: this.option_d,
            correct_answer: this.correct_answer,
        }
    }

    async save() {
        const results = await db.query('INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [this.id, this.text, this.option_a, this.option_b, this.option_c, this.option_d, this.correct_answer]);
        return results;
    }

    async update(text=null, option_a=null, option_b=null, option_c=null, option_d=null, correct_answer=null) {
        const results = await db.query('UPDATE questions SET text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ? WHERE id = ?', 
            [text || this.text,
                option_a || this.option_a,
                option_b || this.option_b,
                option_c || this.option_c,
                option_d || this.option_d,
                correct_answer || this.correct_answer,
                this.id]);
        return results;
    }

    async delete() {
        const results = await db.query('DELETE FROM questions WHERE id = ?', [this.id]);
        return results;
    }
}

export default Question;
