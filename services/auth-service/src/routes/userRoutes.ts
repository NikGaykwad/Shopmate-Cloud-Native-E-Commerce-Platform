import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
    getProfile,
    updateProfile,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from '../controllers/userController';

const router = Router();

// Profile Routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Address Routes
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);
router.put('/addresses/:id', authenticate, updateAddress);
router.delete('/addresses/:id', authenticate, deleteAddress);
router.put('/addresses/:id/default', authenticate, setDefaultAddress);

export default router;
