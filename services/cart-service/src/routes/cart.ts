import { Router } from 'express';
import { getCart, addToCart, clearCart } from '../controllers/cartController';

const router = Router();

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/', clearCart);

export default router;
