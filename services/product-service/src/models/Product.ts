import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
    createdAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

// Create a text index for search
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model<IProduct>('Product', ProductSchema);
