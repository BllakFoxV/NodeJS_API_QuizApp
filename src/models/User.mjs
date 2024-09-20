import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import config from '../config/config.mjs';
import db from '../db/connection.mjs';

class User {
    constructor(fullname, email, password, isActive = false, isAdmin = false, id = uuidv4(), createdAt = new Date()) {

        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.is_active = isActive;
        this.is_admin = isAdmin;
        this.created_at = createdAt;
        this.salt = bcrypt.genSaltSync(10);
    }

    async setPassword(password) {
        this.salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(password + config.SECRET_KEY, this.salt);
    }

    async verifyPassword(password) {
        return bcrypt.compare(password + config.SECRET_KEY, this.password);
    }

    static fromJSON(json) {
        if (json) {
            return new User(
                json.fullname,
                json.email,
                json.password,
                json.is_active,
                json.is_admin,
                json.id,
                new Date(json.createdAt)
            );
        }
        return null;
    }

    isAdmin() {
        return this.is_admin;
    }

    toJSON() {
        return {
            id: this.id,
            fullname: this.fullname,
            email: this.email,
            is_active: this.is_active,
            is_admin: this.is_admin,
            created_at: this.created_at
        };
    }

    static async getCount() {
        const [results] = await db.query(`SELECT COUNT(*) FROM users`);
        return results ? parseInt(results['COUNT(*)']) : 0;
    }

    static async getAll(count = 10, page = 1) {
        const results = await db.query(`SELECT * FROM users ORDER BY RAND() LIMIT ? OFFSET ?`, [parseInt(count), (page - 1) * parseInt(count)]);
        return results.map(result => this.fromJSON(result));
    }

    static async findByEmail(email) {
        const [results] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        return results ? User.fromJSON(results) : null;
    }

    static async findById(id) {
        const [results] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
        return results ? User.fromJSON(results) : null;
    }

    async setActive(isActive) {
        this.is_active = isActive;
        const result = await db.query(
            'UPDATE users SET is_active = ? WHERE id = ?',
            [this.is_active, this.id]
        );
        if (!result || !result.affectedRows) {
            return false;
        }
        return true;
    }

    async save() {
        try {
            const existingUser = await User.findByEmail(this.email);
            if (existingUser) {
                throw new Error('User already exists');
            }

            const result = await db.query(
                'INSERT INTO users (id, fullname, email, password, salt, is_active, is_admin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [this.id, this.fullname, this.email, this.password, this.salt, this.is_active, this.is_admin, this.created_at]
            );

            if (!result || !result.affectedRows) {
                throw new Error('Insert failed: No rows affected');
            }

            return { success: true, id: this.id };
        } catch (error) {
            console.error('Error saving user:', error);
            return { success: false, error: error.message };
        }
    }

    async update() {
        const result = await db.query(
            'UPDATE users SET fullname = ?, email = ?, password = ?, salt = ?, is_active = ?, is_admin = ? WHERE id = ?',
            [this.fullname, this.email, this.password, this.salt, this.is_active, this.is_admin, this.id]
        );
        if (!result || !result.affectedRows) {
            return false;
        }
        return true;
    }

    async updatePassword(old_password, new_password) {
        if (!await this.verifyPassword(old_password)) {
            throw new Error('Old password is incorrect');
        }
        await this.setPassword(new_password);
        return await this.update();
    }

    async delete() {
        const result = await db.query('DELETE FROM users WHERE id = ?', [this.id]);
        return result;
    }
}

export default User;