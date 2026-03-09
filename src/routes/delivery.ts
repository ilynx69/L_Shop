import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { readJSON, writeJSON } from '../utils/fileHelpers';
import { Delivery } from '../models/Delivery';
import { User } from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Все маршруты в этом файле требуют аутентификации
router.use(authMiddleware);

// Оформление доставки
router.post('/', async (req: Request, res: Response) => {
    try {
        const { address, phone, email, paymentMethod } = req.body;

        // Валидация
        if (!address || !phone || !email || !paymentMethod) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        // Проверим, существует ли пользователь
        const users = await readJSON<User[]>('users.json');
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        // Создаём запись о доставке
        const newDelivery: Delivery = {
            id: uuidv4(),
            userId,
            address,
            phone,
            email,
            paymentMethod,
            createdAt: new Date().toISOString(),
        };

        const deliveries = await readJSON<Delivery[]>('deliveries.json');
        deliveries.push(newDelivery);
        await writeJSON('deliveries.json', deliveries);

        // Отправляем запрос к бэкенд-разработчику 2 для очистки корзины
        // Предполагаемый URL второго бэкенда (уточни у команды)
        try {
            await axios.post('http://localhost:3001/cart/clear', {}, {
                headers: {
                    Cookie: `token=${req.cookies.token}`
                }
            });
            console.log('Корзина очищена');
        } catch (error) {
            console.error('Ошибка при очистке корзины:', error);
            // Не прерываем оформление доставки
        }

        res.status(201).json({ message: 'Доставка оформлена', delivery: newDelivery });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;