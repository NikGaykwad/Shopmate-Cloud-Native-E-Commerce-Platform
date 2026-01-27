import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8007;

app.use(cors());
app.use(express.json());

app.use('/payments', paymentRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'payment-service' });
});

app.listen(PORT, () => {
    console.log(`🚀 Payment Service running on port ${PORT}`);
});
