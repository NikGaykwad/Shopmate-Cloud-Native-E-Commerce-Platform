import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'shopmate_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'shopmate_db',
    password: process.env.DB_PASSWORD || 'shopmate_password',
    port: parseInt(process.env.DB_PORT || '5432'),
});

pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL (Order Service)');
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
