import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

interface ProductSliderProps {
    title: string;
    category: string;
    bgColor?: string; // Optional background color for the section
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, category, bgColor = 'bg-white' }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch by category
                const res = await axios.get(`${API_URL}/products?category=${category}`);
                setProducts(res.data);
            } catch (error) {
                console.error(`Failed to fetch ${category}`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    if (loading) return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;
    if (products.length === 0) return null; // Don't show empty sections

    return (
        <div className={`py-6 mb-4 ${bgColor} rounded-xl shadow-sm border border-gray-100`}>
            <div className="flex justify-between items-center px-6 mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
                <Link to={`/category/${category}`} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">
                    <ChevronRight size={20} />
                </Link>
            </div>

            <div className="flex overflow-x-auto pb-6 px-6 gap-4 snap-x hide-scrollbar scroll-smooth">
                {products.map((product) => (
                    <Link
                        to={`/product/${product._id || product.id}`}
                        key={product._id || product.id}
                        className="min-w-[200px] md:min-w-[240px] snap-start bg-white rounded-xl border border-gray-100 p-3 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                    >
                        <div className="h-40 w-full mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative">
                            {product.images?.[0] ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <span className="text-gray-400 text-xs">No Image</span>
                            )}
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                <span className="text-xs text-green-600 font-medium">Free Delivery</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductSlider;
