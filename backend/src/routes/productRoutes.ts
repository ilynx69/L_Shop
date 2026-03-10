import { Router } from 'express';
import * as productCtrl from '../controllers/productController';

const router = Router();

router.get('/', productCtrl.getProducts);
router.get('/categories', productCtrl.getCategories);
router.get('/:id', productCtrl.getProductById);

export default router;