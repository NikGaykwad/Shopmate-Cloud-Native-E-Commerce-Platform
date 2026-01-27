import { Router } from 'express';
import { getProducts, createProduct, getProductById, updateStock } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.patch('/:id/stock', updateStock);

export default router;
