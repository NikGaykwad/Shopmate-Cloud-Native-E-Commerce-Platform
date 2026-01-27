import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cartRoutes from './routes/cart';
import './config/redis'; // Ensure Redis connects

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8005;

app.use(cors());
app.use(express.json());

app.use('/cart', cartRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'cart-service' });
});

app.listen(PORT, () => {
    console.log(`🚀 Cart Service running on port ${PORT}`);
});
