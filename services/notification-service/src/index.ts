import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8008; // 8008

app.use(cors());
app.use(express.json());

app.post('/notify', (req, res) => {
    const { userId, type, message } = req.body;
    console.log(`🔔 [NOTIFICATION] To User ${userId} [${type}]: ${message}`);
    res.json({ message: 'Notification sent' });
});

app.listen(PORT, () => console.log(`🚀 Notification Service running on port ${PORT}`));
