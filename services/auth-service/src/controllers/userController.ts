import { Request, Response } from 'express';
import { query } from '../config/db';

// ==========================================
// PROFILE MANAGEMENT
// ==========================================

export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const result = await query('SELECT id, email, full_name, phone_number, role, created_at FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { full_name, phone_number } = req.body;

    try {
        const result = await query(
            'UPDATE users SET full_name = COALESCE($1, full_name), phone_number = COALESCE($2, phone_number) WHERE id = $3 RETURNING id, email, full_name, phone_number, role',
            [full_name, phone_number, userId]
        );
        res.json({ message: 'Profile updated successfully', user: result.rows[0] });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ==========================================
// ADDRESS MANAGEMENT
// ==========================================

export const getAddresses = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const result = await query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addAddress = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { full_name, phone_number, address_line, city, state, pincode, country, is_default } = req.body;

    if (!full_name || !phone_number || !address_line || !city || !state || !pincode || !country) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await query('BEGIN');

        // If this is set as default, unset other defaults
        if (is_default) {
            await query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }

        // If it's the first address, make it default automatically
        const countRes = await query('SELECT COUNT(*) FROM addresses WHERE user_id = $1', [userId]);
        const isFirst = parseInt(countRes.rows[0].count) === 0;
        const setAsDefault = is_default || isFirst;

        const result = await query(
            `INSERT INTO addresses 
            (user_id, full_name, phone_number, address_line, city, state, pincode, country, is_default) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`,
            [userId, full_name, phone_number, address_line, city, state, pincode, country, setAsDefault]
        );

        await query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await query('ROLLBACK');
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { full_name, phone_number, address_line, city, state, pincode, country, is_default } = req.body;

    try {
        const check = await query('SELECT * FROM addresses WHERE id = $1 AND user_id = $2', [id, userId]);
        if (check.rows.length === 0) return res.status(404).json({ message: 'Address not found' });

        await query('BEGIN');

        if (is_default) {
            await query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }

        const result = await query(
            `UPDATE addresses SET 
            full_name = $1, phone_number = $2, address_line = $3, city = $4, state = $5, pincode = $6, country = $7, is_default = COALESCE($8, is_default)
            WHERE id = $9 AND user_id = $10 
            RETURNING *`,
            [full_name, phone_number, address_line, city, state, pincode, country, is_default, id, userId]
        );

        await query('COMMIT');
        res.json(result.rows[0]);
    } catch (error) {
        await query('ROLLBACK');
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;

    try {
        const result = await query('DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Address not found' });
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const setDefaultAddress = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { id } = req.params;

    try {
        await query('BEGIN');
        await query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        const result = await query('UPDATE addresses SET is_default = TRUE WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);

        if (result.rows.length === 0) {
            await query('ROLLBACK');
            return res.status(404).json({ message: 'Address not found' });
        }

        await query('COMMIT');
        res.json(result.rows[0]);
    } catch (error) {
        await query('ROLLBACK');
        console.error('Error setting default address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
