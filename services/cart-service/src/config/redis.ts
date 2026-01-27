import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const client = createClient({
    url: REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('📦 Connected to Redis (Cart Service)'));

(async () => {
    if (!client.isOpen) {
        await client.connect();
    }
})();

export default client;
