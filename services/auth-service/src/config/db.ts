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

// Initialize Database with Retry Logic
const initDB = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            // Users Table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    full_name VARCHAR(100),
                    phone_number VARCHAR(20),
                    role VARCHAR(50) DEFAULT 'customer',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Add phone_number column if it doesn't exist (migrations for existing dbs)
            await pool.query(`
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone_number') THEN 
                        ALTER TABLE users ADD COLUMN phone_number VARCHAR(20); 
                    END IF; 
                END $$;
            `);

            // Addresses Table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS addresses (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    full_name VARCHAR(100) NOT NULL,
                    phone_number VARCHAR(20) NOT NULL,
                    address_line TEXT NOT NULL,
                    city VARCHAR(100) NOT NULL,
                    state VARCHAR(100) NOT NULL,
                    pincode VARCHAR(20) NOT NULL,
                    country VARCHAR(100) NOT NULL,
                    is_default BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            console.log('✅ Database initialized successfully (Users & Addresses tables ready)');
            return;
        } catch (err) {
            console.error(`❌ Failed to initialize database (Retries left: ${retries - 1}):`, err);
            retries--;
            await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds
        }
    }
    console.error('❌ Could not initialize database after multiple attempts');
};

// Connect and then init
pool.connect().then(() => {
    console.log('📦 Connected to PostgreSQL Database');
    initDB();
}).catch(err => console.error('Connection error', err));

export const query = (text: string, params?: any[]) => pool.query(text, params);
