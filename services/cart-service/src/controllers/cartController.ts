import { Request, Response } from 'express';
import redisClient from '../config/redis';

// Key helper
const getCartKey = (userId: string) => `cart:${userId}`;

export const getCart = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string; // Assume Gateway passes this
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    try {
        const data = await redisClient.get(getCartKey(userId));
        const cart = data ? JSON.parse(data) : [];
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const { productId, quantity, price, name, image } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID required' });

    try {
        const key = getCartKey(userId);
        const data = await redisClient.get(key);
        let cart = data ? JSON.parse(data) : [];

        const existingItemIndex = cart.findIndex((item: any) => item.productId === productId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ productId, quantity, price, name, image });
        }

        await redisClient.set(key, JSON.stringify(cart), { EX: 86400 }); // 24h expire
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

export const clearCart = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    try {
        await redisClient.del(getCartKey(userId));
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart' });
    }
}
