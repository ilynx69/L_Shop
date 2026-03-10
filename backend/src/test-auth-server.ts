import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Хранилище пользователей (в памяти)
const users: any[] = [];
let sessions: any = {};

// Регистрация
app.post('/api/auth/register', (req, res) => {
    const { name, email, login, phone, password } = req.body;
    if (users.find(u => u.login === login || u.email === email)) {
        return res.status(400).json({ error: 'User exists' });
    }
    const newUser = {
        id: String(users.length + 1),
        name, email, login, phone,
        password: password,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    const sessionId = newUser.id;
    sessions[sessionId] = Date.now() + 10 * 60 * 1000;
    res.cookie('session', sessionId, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        sameSite: 'strict'
    });
    res.status(201).json({ 
        message: 'Registered', 
        user: { ...newUser, password: undefined } 
    });
});

// Логин
app.post('/api/auth/login', (req, res) => {
    const { login, password } = req.body;
    const user = users.find(u => u.login === login || u.email === login);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const sessionId = user.id;
    sessions[sessionId] = Date.now() + 10 * 60 * 1000;
    res.cookie('session', sessionId, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        sameSite: 'strict'
    });
    res.json({ 
        message: 'Logged in', 
        user: { ...user, password: undefined } 
    });
});

// Получить текущего пользователя
app.get('/api/auth/me', (req, res) => {
    const sessionId = req.cookies?.session;
    if (!sessionId || !sessions[sessionId] || sessions[sessionId] < Date.now()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = users.find(u => u.id === sessionId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { ...user, password: undefined } });
});

// Выход
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('session');
    res.json({ message: 'Logged out' });
});

// ========== ДОСТАВКА ==========
app.post('/api/delivery', (req, res) => {
    const sessionId = req.cookies?.session;
    if (!sessionId || !sessions[sessionId] || sessions[sessionId] < Date.now()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { address, phone, email, paymentMethod } = req.body;
    const delivery = {
        id: String(Date.now()),
        userId: sessionId,
        address,
        phone,
        email,
        paymentMethod,
        createdAt: new Date().toISOString()
    };
    // Можно сохранить в массив, но для теста просто возвращаем
    res.status(201).json({ message: 'Delivery created', delivery });
});

app.listen(PORT, () => {
    console.log(`✅ Тестовый бэкенд-1 запущен на порту ${PORT}`);
});