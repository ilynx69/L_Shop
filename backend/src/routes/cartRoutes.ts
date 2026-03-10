import { Router } from 'express';
import * as cartCtrl from '../controllers/cartController';
// предполагаем auth middleware
import { authMiddleware } from '../middleware/auth'; // должен быть у коллеги

const router = Router();

router.use(authMiddleware); // все маршруты корзины — только авторизованные

router.get('/', cartCtrl.getCart);
router.post('/items', cartCtrl.addToCart);
router.put('/items/:productId', cartCtrl.updateCartItem);
router.delete('/items/:productId', cartCtrl.removeFromCart);
router.delete('/', (req, res) => {
  // можно сделать, но обычно вызывается не фронтом, а бэкендом после заказа
  res.status(403).json({ error: 'Direct clear not allowed' });
});

export default router;