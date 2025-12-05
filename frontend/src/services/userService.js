import api from './api';

export const userService = {
  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/user/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

