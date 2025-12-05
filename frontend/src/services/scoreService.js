import api from './api';

export const scoreService = {
  async submitScore(points, level, lines) {
    const response = await api.post('/scores/submit', { points, level, lines });
    return response.data;
  },

  async getTopScores() {
    const response = await api.get('/scores/top');
    return response.data;
  },

  async getMyScores() {
    const response = await api.get('/scores/my');
    return response.data;
  }
};

