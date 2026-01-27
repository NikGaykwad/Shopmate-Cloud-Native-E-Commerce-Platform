import { Request, Response } from 'express';
import { query } from '../config/db';

export const processPayment = async (req: Request, res: Response) => {
    const { orderId, amount, method, cardNumber } = req.body;

    if (!orderId || !amount || !method) {
        return res.status(400).json({ message: 'Missing payment details' });
    }

    // Simulate validation
    if (method === 'credit_card' && (!cardNumber || cardNumber.length < 16)) {
        return res.status(400).json({ message: 'Invalid card number' });
    }

    // Simulate creating a payment record
    try {
        // Generate a fake transaction ID
        const transactionId = 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const result = await query(
            'INSERT INTO payments (order_id, amount, status, method, transaction_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [orderId, amount, 'success', method, transactionId]
        );

        // In a real app, we would update the Order Service here (via HTTP or Event Bus)
        // For now, we assume the frontend handles the success state or we just return success

        res.status(201).json({
            message: 'Payment Successful',
            payment: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment processing failed' });
    }
};
