import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { readJSON, writeJSON } from './utils/fileUtils';

interface User {
    id: string;
    name: string;
    email: string;
    login: string;
    phone: string;
    password: string;
    createdAt: string;
}

interface Delivery {
    id: string;
    userId: string;
    address: string;
    phone: string;
    email: string;
    paymentMethod: string;
    createdAt: string;
}

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000', // строго этот адрес, не '*'
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ========== ПОЛЬЗОВАТЕЛИ (без изменений) ==========
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, login, phone, password } = req.body;
        const users: User[] = await readJSON<User>('users.json');
        if (users.find(u => u.login === login || u.email === email)) {
            return res.status(400).json({ error: 'User exists' });
        }
        const newUser: User = {
            id: String(users.length + 1),
            name, email, login, phone,
            password,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        await writeJSON('users.json', users);
        res.cookie('session', newUser.id, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
            sameSite: 'strict'
        });
        res.status(201).json({
            message: 'Registered',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, login: newUser.login, phone: newUser.phone, createdAt: newUser.createdAt }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const users: User[] = await readJSON<User>('users.json');
        const user = users.find(u => u.login === login || u.email === login);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.cookie('session', user.id, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
            sameSite: 'strict'
        });
        res.json({
            message: 'Logged in',
            user: { id: user.id, name: user.name, email: user.email, login: user.login, phone: user.phone, createdAt: user.createdAt }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/auth/me', async (req, res) => {
    try {
        const userId = req.cookies?.session;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const users: User[] = await readJSON<User>('users.json');
        const user = users.find(u => u.id === userId);
        if (!user) return res.status(401).json({ error: 'User not found' });
        res.json({
            user: { id: user.id, name: user.name, email: user.email, login: user.login, phone: user.phone, createdAt: user.createdAt }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('session');
    res.json({ message: 'Logged out' });
});

// ========== ДОСТАВКА (ДОБАВЛЕНЫ НОВЫЕ ЭНДПОИНТЫ) ==========
// Создание доставки (было)
app.post('/api/delivery', async (req, res) => {
    try {
        const userId = req.cookies?.session;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const users: User[] = await readJSON<User>('users.json');
        const user = users.find(u => u.id === userId);
        if (!user) return res.status(401).json({ error: 'User not found' });

        const { address, phone, email, paymentMethod } = req.body;
        const deliveries: Delivery[] = await readJSON<Delivery>('deliveries.json');
        const newDelivery: Delivery = {
            id: String(Date.now()),
            userId,
            address, phone, email, paymentMethod,
            createdAt: new Date().toISOString()
        };
        deliveries.push(newDelivery);
        await writeJSON('deliveries.json', deliveries);
        res.status(201).json({ message: 'Delivery created', delivery: newDelivery });
    } catch (error) {
        console.error('Delivery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// **НОВОЕ: Получить все доставки текущего пользователя**
app.get('/api/deliveries', async (req, res) => {
    try {
        const userId = req.cookies?.session;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const deliveries: Delivery[] = await readJSON<Delivery>('deliveries.json');
        const userDeliveries = deliveries.filter(d => d.userId === userId);
        res.json(userDeliveries);
    } catch (error) {
        console.error('Get deliveries error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// **НОВОЕ: Отменить доставку (удалить)**
app.delete('/api/delivery/:id', async (req, res) => {
    try {
        const userId = req.cookies?.session;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const deliveryId = req.params.id;
        const deliveries: Delivery[] = await readJSON<Delivery>('deliveries.json');
        const index = deliveries.findIndex(d => d.id === deliveryId && d.userId === userId);
        if (index === -1) return res.status(404).json({ error: 'Delivery not found' });
        deliveries.splice(index, 1);
        await writeJSON('deliveries.json', deliveries);
        res.json({ message: 'Delivery cancelled' });
    } catch (error) {
        console.error('Cancel delivery error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Бэкенд пользователей и доставки (с файлами) запущен на порту ${PORT}`);
});