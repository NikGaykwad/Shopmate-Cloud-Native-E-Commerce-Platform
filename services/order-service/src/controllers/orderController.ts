import { Request, Response } from 'express';
import { query } from '../config/db';
import axios from 'axios';

export const createOrder = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const { items, shippingAddress, paymentInfo } = req.body;

    // 1. Mandatory Input Validation
    if (!userId) return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    if (!shippingAddress) return res.status(400).json({ message: 'Shipping address is required' });
    if (!paymentInfo) return res.status(400).json({ message: 'Payment information is required' });
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    try {
        await query('BEGIN');

        let totalAmount = 0;
        const processedItems = [];
        const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:8003';

        // 2. Verify Price and Stock via Product Service
        for (const item of items) {
            try {
                // Fetch real product details. Do NOT trust frontend price.
                const productRes = await axios.get(`${PRODUCT_SERVICE_URL}/products/${item.productId}`);
                const product = productRes.data;

                if (!product) throw new Error(`Product not found: ${item.productId}`);
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                // Add to processed items with REAL price
                processedItems.push({
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price // Using backend price
                });

                totalAmount += product.price * item.quantity;
            } catch (err: any) {
                // Re-throw to trigger rollback
                throw new Error(err.response?.data?.message || err.message || 'Product verification failed');
            }
        }

        // 3. Deduct Stock (Atomic-ish)
        for (const item of processedItems) {
            try {
                await axios.patch(`${PRODUCT_SERVICE_URL}/products/${item.productId}/stock`, {
                    quantity: item.quantity
                });
            } catch (err) {
                throw new Error(`Failed to update stock for product ${item.productId}`);
            }
        }

        // 4. Create Order with Address and Payment Info
        const orderResult = await query(
            'INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_info) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [userId, totalAmount, 'placed', JSON.stringify(shippingAddress), JSON.stringify(paymentInfo)]
        );
        const orderId = orderResult.rows[0].id;

        // 5. Create Order Items
        for (const item of processedItems) {
            await query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                [orderId, item.productId, item.quantity, item.price]
            );
        }

        await query('COMMIT');
        res.status(201).json({ message: 'Order placed successfully', orderId });

    } catch (error: any) {
        await query('ROLLBACK');
        console.error('Order creation failed:', error.message);
        if (error.message.includes('Insufficient stock')) {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Order creation failed', error: error.message });
    }
};

export const getOrders = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    try {
        const result = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export const getOrderDetails = async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        // Fetch order basic info and verify ownership
        const orderRes = await query(
            'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (orderRes.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderRes.rows[0];

        // Fetch order items
        const itemsRes = await query(
            'SELECT * FROM order_items WHERE order_id = $1',
            [id]
        );

        // Enhance items with product details via Product Service
        const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:8003';
        const itemsWithDetails = await Promise.all(itemsRes.rows.map(async (item) => {
            try {
                const productRes = await axios.get(`${PRODUCT_SERVICE_URL}/products/${item.product_id}`);
                return {
                    ...item,
                    product: productRes.data
                };
            } catch (err) {
                return {
                    ...item,
                    product: { name: 'Product Unavailable', images: [] }
                };
            }
        }));

        res.json({
            ...order,
            items: itemsWithDetails
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
};
