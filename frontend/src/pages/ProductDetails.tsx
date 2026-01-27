import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const { addToCart } = useCart();

    const handleAddToCart = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
            return;
        }
        setAddingToCart(true);
        // Simulate network delay for better UX
        setTimeout(() => {
            addToCart(product);
            setAddingToCart(false);
            // Optional: Show a toast or notification here
        }, 500);
    };

    const handleBuyNow = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(product);
        navigate('/cart');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
    );

    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                {/* Image Section */}
                <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-square relative shadow-inner">
                    {product.images && product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-contain p-8"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex flex-col justify-center">
                    <div className="mb-6">
                        <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase">{product.category || 'Product'}</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4 leading-tight">{product.name}</h1>
                        <p className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                    </div>

                    <div className="prose prose-lg text-gray-500 mb-8">
                        <p>{product.description}</p>
                        <p>Experience premium quality with our meticulously crafted {product.name}. Designed for modern living, it combines functionality with aesthetic elegance.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-transform active:scale-[0.98] flex items-center justify-center space-x-2"
                        >
                            <ShoppingCart size={20} />
                            <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-transform active:scale-[0.98]"
                        >
                            Buy Now
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                        <div className="flex items-center space-x-3 text-gray-600">
                            <Truck className="text-indigo-600" />
                            <span className="text-sm font-medium">Free Express Shipping</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-600">
                            <ShieldCheck className="text-indigo-600" />
                            <span className="text-sm font-medium">2 Year Warranty</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
