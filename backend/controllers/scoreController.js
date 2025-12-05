import Score from '../models/Score.js';
import User from '../models/User.js';

// Сохранение результата
export const submitScore = async (req, res) => {
  try {
    const { points, level, lines } = req.body;
    const userId = req.userId;

    if (!points || !level || !lines) {
      return res.status(400).json({ error: 'Необходимы points, level и lines' });
    }

    const score = new Score({
      userId,
      points,
      level,
      lines
    });

    await score.save();

    res.status(201).json({ message: 'Результат сохранён', score });
  } catch (error) {
    console.error('Ошибка сохранения результата:', error);
    res.status(500).json({ error: 'Ошибка сервера при сохранении результата' });
  }
};

// Получение топа-10
export const getTopScores = async (req, res) => {
  try {
    const topScores = await Score.find()
      .populate('userId', 'name email')
      .sort({ points: -1 })
      .limit(10)
      .exec();

    res.json(topScores);
  } catch (error) {
    console.error('Ошибка получения топа:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении топа' });
  }
};

// Получение личной статистики
export const getMyScores = async (req, res) => {
  try {
    const userId = req.userId;

    const scores = await Score.find({ userId })
      .sort({ points: -1 })
      .exec();

    // Вычисление статистики
    const bestScore = scores.length > 0 ? scores[0].points : 0;
    const totalGames = scores.length;
    const averageScore = totalGames > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.points, 0) / totalGames)
      : 0;
    const totalLines = scores.reduce((sum, s) => sum + s.lines, 0);

    res.json({
      bestScore,
      averageScore,
      totalGames,
      totalLines,
      scores: scores.slice(0, 10) // Последние 10 результатов
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении статистики' });
  }
};

