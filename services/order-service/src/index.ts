import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8006;

app.use(cors());
app.use(express.json());

app.use('/orders', orderRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'order-service' });
});

import { runMigrations } from './migrations';

// ... (existing code)

app.listen(PORT, async () => {
    await runMigrations();
    console.log(`🚀 Order Service running on port ${PORT}`);
});
