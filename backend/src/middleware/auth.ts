import { Request, Response, NextFunction } from 'express';
<<<<<<< HEAD
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Не авторизован' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Неверный токен' });
    }
=======

// Временная заглушка — пока нет настоящей авторизации
// Позже заменишь на реальную проверку куки / JWT
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Для тестов/разработки пропускаем всех
  // req.user = { id: 'test-user-123' }; // ← можно раскомментировать для симуляции

  // Реальная версия (когда будет куки):
  // const userId = req.cookies?.userId || req.signedCookies?.userId;
  // if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  // req.user = { id: userId };

  next();
>>>>>>> 775bc22 (feat: товары и корзина)
};