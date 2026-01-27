import { query } from './config/db';

export const runMigrations = async () => {
    try {
        console.log('🔄 Running Database Migrations...');

        // Create Orders Table
        await query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                total_amount NUMERIC(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                shipping_address JSONB,
                payment_info JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create Order Items Table
        await query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id VARCHAR(255) NOT NULL,
                quantity INTEGER NOT NULL,
                price_at_purchase NUMERIC(10, 2) NOT NULL
            );
        `);

        console.log('✅ Migrations completed successfully.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
};
