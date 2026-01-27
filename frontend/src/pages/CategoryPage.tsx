import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch all and filter client-side for now, or update API to support filter
                // Ideally: axios.get(`${API_URL}/products?category=${categoryName}`);
                // For now, assuming API returns all or we filter here if backend doesn't support query yet
                const res = await axios.get(`${API_URL}/products?category=${categoryName}`);
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryName]);

    // Format category name for display
    const displayName = categoryName
        ? categoryName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : 'Products';

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-10">
                <div className="text-sm text-gray-500 mb-2">Home / {displayName}</div>
                <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                <p className="text-gray-500 mt-2">Explore our collection of premium {displayName.toLowerCase()}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-xl text-gray-400">No products found in this category.</p>
                        <p className="text-sm text-gray-400 mt-2">Try "Electronics" or populate more data.</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product._id || product.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                            <div className="h-64 overflow-hidden relative bg-gray-100 flex items-center justify-center">
                                {product.images && product.images[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                ) : (
                                    <span className="text-gray-400">No Image</span>
                                )}
                                <Link
                                    to={`/product/${product._id || product.id}`}
                                    className="absolute inset-0 z-10"
                                />
                                <button className="absolute bottom-4 right-4 z-20 bg-white text-black p-3 rounded-full shadow-lg translate-y-20 group-hover:translate-y-0 transition-transform duration-300 hover:bg-black hover:text-white">
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <Link to={`/product/${product._id || product.id}`} className="block">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">{product.name}</h3>
                                </Link>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-3 flex-grow">{product.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default CategoryPage;
