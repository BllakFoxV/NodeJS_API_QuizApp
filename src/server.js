import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import initializeDatabase from './db/initDB.mjs';

import authRoutes from './routes/auth.mjs';
import quizRoutes from './routes/quiz.mjs';
import adminRoutes from './routes/admin.mjs';
import userRoutes from './routes/user.mjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Quiz App API' });
});

app.listen(port, async () => {
  try {
    await initializeDatabase();

    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
});