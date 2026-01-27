import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8004;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopmate_products')
    .then(() => console.log('📦 Connected to MongoDB (Search Service)'));

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    images: [String]
});
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });
const Product = mongoose.model('Product', ProductSchema);

app.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter "q" is required' });

    try {
        const results = await Product.find({ $text: { $search: q as string } });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error searching products' });
    }
});

app.listen(PORT, () => console.log(`🚀 Search Service running on port ${PORT}`));
