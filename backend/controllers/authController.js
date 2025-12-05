import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

// Регистрация
export const register = async (req, res) => {
    try {
        const {email, password, name} = req.body;

        // Валидация
        if (!email || !password || !name) {
            return res.status(400).json({error: 'Все поля обязательны'});
        }

        if (password.length < 6) {
            return res.status(400).json({error: 'Пароль должен быть не менее 6 символов'});
        }

        // Проверка существования пользователя
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: 'Пользователь с таким email уже существует'});
        }

        // Хеширование пароля
        const passwordHash = await bcrypt.hash(password, 10);

        // Создание пользователя
        const user = new User({
            email,
            passwordHash,
            name
        });

        await user.save();

        // Генерация токена
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '7d'});

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({error: 'Ошибка сервера при регистрации'});
    }
};

// Вход
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Валидация
        if (!email || !password) {
            return res.status(400).json({error: 'Email и пароль обязательны'});
        }

        // Поиск пользователя
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({error: 'Неверный email или пароль'});
        }

        // Проверка пароля
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({error: 'Неверный email или пароль'});
        }

        // Генерация токена
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '7d'});

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({error: 'Ошибка сервера при входе'});
    }
};
