import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our premium collection.</p>
                <Link to="/" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                )}
                            </div>

                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">₹{item.price.toLocaleString()}</p>
                            </div>

                            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                <div className="flex items-center bg-gray-50 rounded-lg px-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-600 hover:text-black transition-colors"><Minus size={16} /></button>
                                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-600 hover:text-black transition-colors"><Plus size={16} /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (Estimate)</span>
                                <span>₹{Math.round(totalAmount * 0.08).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mb-8">
                            <div className="flex justify-between text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{Math.round(totalAmount * 1.08).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const user = localStorage.getItem('user');
                                if (!user) {
                                    navigate('/login');
                                } else {
                                    navigate('/checkout');
                                }
                            }}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-transform active:scale-[0.98] flex justify-center items-center group"
                        >
                            Checkout <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
