import { Router } from 'express';
import { createOrder, getOrders, getOrderDetails } from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderDetails);

export default router;
