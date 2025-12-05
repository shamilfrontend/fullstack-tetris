import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Получение профиля
export const getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({error: 'Пользователь не найден'});
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({error: 'Ошибка сервера при получении профиля'});
    }
};

// Смена пароля
export const changePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword} = req.body;
        const userId = req.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({error: 'Текущий и новый пароль обязательны'});
        }

        if (newPassword.length < 6) {
            return res.status(400).json({error: 'Новый пароль должен быть не менее 6 символов'});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'Пользователь не найден'});
        }

        // Проверка текущего пароля
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({error: 'Неверный текущий пароль'});
        }

        // Хеширование нового пароля
        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.passwordHash = passwordHash;
        await user.save();

        res.json({message: 'Пароль успешно изменён'});
    } catch (error) {
        console.error('Ошибка смены пароля:', error);
        res.status(500).json({error: 'Ошибка сервера при смене пароля'});
    }
};
