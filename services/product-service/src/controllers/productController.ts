import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const query = req.query;
        // If query has 'category', use it. Otherwise return all.
        // We can pass req.query directly if we trust it, or build a filter object.
        // For simple usage:
        const filter: any = {};
        if (query.category) {
            filter.category = query.category;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

export const updateStock = async (req: Request, res: Response) => {
    try {
        const { quantity } = req.body; // quantity to deduct (positive integer)
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        product.stock -= quantity;
        await product.save();

        res.json({ message: 'Stock updated', stock: product.stock });
    } catch (error) {
        res.status(500).json({ message: 'Error updating stock' });
    }
};
