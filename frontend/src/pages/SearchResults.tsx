import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                if (query) {
                    const res = await axios.get(`${API_URL}/search?q=${query}`);
                    setProducts(res.data);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-8"
            >
                Search Results for "{query}"
            </motion.h2>

            {loading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-xl text-gray-500">No products found matching "{query}"</p>
                    <Link to="/" className="inline-block mt-4 text-black font-semibold hover:underline">
                        Return Home
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <Link to={`/product/${product._id}`} key={product._id} className="group">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="absolute top-0 left-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                                    <h3 className="font-bold text-lg mb-2 truncate group-hover:text-amber-600 transition-colors">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xl font-black">₹{product.price?.toLocaleString()}</span>
                                        <button className="bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <ShoppingCart className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
