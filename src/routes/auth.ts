import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readJSON, writeJSON } from '../utils/fileHelpers';
import { User } from '../models/User';

const router = Router();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_MAX_AGE = 10 * 60 * 1000; // 10 минут

// Регистрация
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email и пароль обязательны' });
        }

        const users = await readJSON<User[]>('users.json');

        // Проверяем, существует ли пользователь с таким email
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser: User = {
            id: uuidv4(),
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        await writeJSON('users.json', users);

        // Создаём JWT токен
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '10m' });

        // Устанавливаем httpOnly куку
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: COOKIE_MAX_AGE,
            sameSite: 'lax',
            // secure: process.env.NODE_ENV === 'production', // раскомментировать для HTTPS
        });

        res.status(201).json({
            message: 'Регистрация успешна',
            user: { id: newUser.id, email: newUser.email }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Вход
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email и пароль обязательны' });
        }

        const users = await readJSON<User[]>('users.json');
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '10m' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: COOKIE_MAX_AGE,
            sameSite: 'lax',
        });

        res.json({
            message: 'Вход выполнен',
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Выход
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Выход выполнен' });
});

// Получение текущего пользователя
router.get('/me', async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const users = await readJSON<User[]>('users.json');
        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        res.status(401).json({ message: 'Неверный токен' });
    }
});

export default router;