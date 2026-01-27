import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import productRoutes from './routes/products';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'product-service' });
});

app.listen(PORT, () => {
    console.log(`🚀 Product Service running on port ${PORT}`);
});
