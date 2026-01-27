import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER || 'shopmate_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'shopmate_db',
    password: process.env.DB_PASSWORD || 'shopmate_password',
    port: parseInt(process.env.DB_PORT || '5432'),
});

app.get('/users/profile', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    try {
        const result = await pool.query('SELECT id, email, full_name, role FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`🚀 User Service running on port ${PORT}`));
