"use strict";
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
pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL (Order Service)');
});
const query = (text, params) => pool.query(text, params);
exports.query = query;
