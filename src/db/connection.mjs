import mysql from 'mysql2/promise';
import dbConfig from '../config/configDB.mjs';
import { v4 as uuidv4 } from 'uuid';

const pool = mysql.createPool(dbConfig);

const query = async (sql, params) => {
    const [results] = await pool.query(sql, params);
    return results;
}

const add_user = async (user) => {
    const id = uuidv4();
    const [results] = await pool.query('INSERT INTO users (id, fullname, email, password, salt) VALUES (?, ?, ?, ?, ?)', [id, user.fullname, user.email, user.password, user.salt]);
    return results;
}

export default {
    query
}