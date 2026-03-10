import { Request, Response, NextFunction } from 'express';

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
};