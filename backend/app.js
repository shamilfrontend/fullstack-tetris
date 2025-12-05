import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import scoreRoutes from './routes/scores.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tetris';

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Подключено к MongoDB');
  })
  .catch((error) => {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  });

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/user', userRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

