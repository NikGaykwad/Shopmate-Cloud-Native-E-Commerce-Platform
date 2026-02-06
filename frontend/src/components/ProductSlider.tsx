import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

interface ProductSliderProps {
    title: string;
    category?: string;
    bgColor?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, category }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `${API_URL}/products`;
                if (category) {
                    url += `?category=${category}`;
                }
                const res = await axios.get(url);
                // Simple logic to just show first 4 items for the slider
                setProducts(res.data.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch products for slider", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    if (loading) return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>;
    if (products.length === 0) return null;

    return (
        <section className="py-8">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <Link to={`/category/${category || 'all'}`} className="text-sm font-semibold text-gray-500 hover:text-black transition-colors">
                    View All &rarr;
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                        <Link to={`/product/${product._id}`} className="block">
                            <div className="aspect-square rounded-xl bg-gray-50 mb-4 overflow-hidden relative">
                                {product.images && product.images[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
                                )}

                            </div>

                            <h3 className="font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                            </div>
                        </Link>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                            className="w-full mt-3 bg-gray-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        >
                            <ShoppingCart size={16} /> Add to Cart
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ProductSlider;
