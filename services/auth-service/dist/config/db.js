"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USER || 'shopmate_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'shopmate_db',
    password: process.env.DB_PASSWORD || 'shopmate_password',
    port: parseInt(process.env.DB_PORT || '5432'),
});
// Initialize Database with Retry Logic
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    let retries = 5;
    while (retries > 0) {
        try {
            // Users Table
            yield pool.query(`
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
            yield pool.query(`
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone_number') THEN 
                        ALTER TABLE users ADD COLUMN phone_number VARCHAR(20); 
                    END IF; 
                END $$;
            `);
            // Addresses Table
            yield pool.query(`
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
        }
        catch (err) {
            console.error(`❌ Failed to initialize database (Retries left: ${retries - 1}):`, err);
            retries--;
            yield new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds
        }
    }
    console.error('❌ Could not initialize database after multiple attempts');
});
// Connect and then init
pool.connect().then(() => {
    console.log('📦 Connected to PostgreSQL Database');
    initDB();
}).catch(err => console.error('Connection error', err));
const query = (text, params) => pool.query(text, params);
exports.query = query;
