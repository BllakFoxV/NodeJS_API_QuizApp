import { createConnection } from 'mysql2/promise';
import dbConfig from '../config/configDB.mjs';

async function initializeDatabase() {
  try {
    const connection = await createConnection(dbConfig);
    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS quiz;');
    
    // Use the quiz database
    await connection.query('USE quiz;');
    
    // Create users table
    console.log('Creating users table');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT FALSE,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        salt VARCHAR(255) NOT NULL
      );
    `);
    
    console.log('Creating questions table');
    // Create questions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id CHAR(36) PRIMARY KEY,
        text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer CHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating quiz_results table');
    // Create quiz_results table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id CHAR(36) PRIMARY KEY,
        user_id CHAR(36) NOT NULL,
        score INT NOT NULL,
        questions_answered INT NOT NULL,
        time_taken INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Add trigger to limit quiz results to 5 per user
    console.log('Creating trigger to limit quiz results');
    await connection.query(`
      CREATE TRIGGER IF NOT EXISTS limit_quiz_results
      AFTER INSERT ON quiz_results
      FOR EACH ROW
      BEGIN
        DELETE FROM quiz_results
        WHERE user_id = NEW.user_id
        AND id NOT IN (
          SELECT id
          FROM (
            SELECT id
            FROM quiz_results
            WHERE user_id = NEW.user_id
            ORDER BY created_at DESC
            LIMIT 5
          ) AS latest_results
        );
      END;
    `);

    await connection.end();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export default initializeDatabase;
