import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, CheckCircle, Truck, Banknote, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

const Checkout = () => {
    const { cart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Shipping State
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        zipCode: ''
    });

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    const [savedAddresses, setSavedAddresses] = useState<any[]>([]); // New state

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token'); // Use token

        if (!user || !token) {
            navigate('/login');
            return;
        }

        const fetchAddresses = async () => {
            try {
                const res = await axios.get(`${API_URL}/users/addresses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSavedAddresses(res.data);

                // Pre-fill default if available
                const defaultAddr = res.data.find((a: any) => a.is_default);
                if (defaultAddr) {
                    setShippingAddress({
                        fullName: defaultAddr.full_name,
                        phone: defaultAddr.phone_number,
                        addressLine: defaultAddr.address_line,
                        city: defaultAddr.city,
                        state: defaultAddr.state,
                        zipCode: defaultAddr.pincode
                    });
                }
            } catch (error) {
                console.error('Failed to fetch addresses', error);
            }
        };
        fetchAddresses();
    }, [navigate]);

    if (cart.length === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic Validation
        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine || !shippingAddress.zipCode) {
            setError('Please fill in all required shipping fields.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (!token || !user) {
                navigate('/login');
                return;
            }

            // Construct payload
            const payload = {
                items: cart.map(item => ({
                    productId: item.id, // Using existing item ID as product ID
                    quantity: item.quantity
                })),
                shippingAddress,
                paymentInfo: {
                    method: paymentMethod,
                    details: paymentMethod === 'card' ? { cardNumber: cardNumber.slice(-4) } : { upiId },
                    status: 'verified' // Mock verification
                }
            };

            await axios.post(`${API_URL}/orders`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            clearCart();
            setStep(3);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-500 mb-8 text-lg max-w-lg">Thank you for your purchase. We have received your order and payment.</p>
                <button onClick={() => navigate('/')} className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-colors">
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Secure Checkout</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-center">
                    <AlertCircle className="mr-2" size={20} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {/* Step 1: Shipping Info */}
                    {step === 1 && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-left duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                                Shipping Details
                            </h2>

                            {savedAddresses.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase">Saved Addresses</h3>
                                    <div className="space-y-3">
                                        {savedAddresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => {
                                                    setShippingAddress({
                                                        fullName: addr.full_name,
                                                        phone: addr.phone_number,
                                                        addressLine: addr.address_line,
                                                        city: addr.city,
                                                        state: addr.state,
                                                        zipCode: addr.pincode
                                                    });
                                                }}
                                                className={`border rounded-xl p-4 cursor-pointer transition-all ${shippingAddress.addressLine === addr.address_line && shippingAddress.zipCode === addr.pincode
                                                    ? 'border-black bg-gray-50 ring-1 ring-black'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-bold text-gray-900">{addr.full_name}</span>
                                                    <span className="text-sm text-gray-500">({addr.phone_number})</span>
                                                    {addr.is_default && <span className="bg-gray-200 text-gray-700 text-xs px-2 rounded">Default</span>}
                                                </div>
                                                <p className="text-sm text-gray-600">{addr.address_line}, {addr.city} - {addr.pincode}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                        <div className="relative flex justify-center"><span className="px-3 bg-white text-gray-500 text-sm">OR ADD NEW</span></div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleNextStep} className="grid grid-cols-2 gap-4">
                                <input name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange} type="text" placeholder="Full Name *" className="col-span-2 p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors w-full" required />
                                <input name="phone" value={shippingAddress.phone} onChange={handleAddressChange} type="tel" placeholder="Phone Number *" className="col-span-2 p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors w-full" required />
                                <input name="addressLine" value={shippingAddress.addressLine} onChange={handleAddressChange} type="text" placeholder="Address Line *" className="col-span-2 p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors w-full" required />
                                <input name="city" value={shippingAddress.city} onChange={handleAddressChange} type="text" placeholder="City *" className="p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors w-full" required />
                                <input name="state" value={shippingAddress.state} onChange={handleAddressChange} type="text" placeholder="State" className="p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors w-full" />
                                <input name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} type="text" placeholder="ZIP Code *" className="p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors w-full" required />

                                <button type="submit" className="col-span-2 w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-transform active:scale-[0.98] mt-4">
                                    Proceed to Payment
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 2: Payment Method */}
                    {step === 2 && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right duration-300">
                            <button onClick={() => setStep(1)} className="text-sm text-gray-500 mb-4 hover:text-black">← Edit Shipping</button>
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                Payment Method
                            </h2>

                            <form onSubmit={handlePlaceOrder} className="space-y-4">
                                <div className="flex space-x-4 mb-6">
                                    {['card', 'upi', 'cod'].map((method) => (
                                        <label key={method} className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="peer sr-only"
                                                checked={paymentMethod === method}
                                                onChange={() => setPaymentMethod(method as any)}
                                            />
                                            <div className="p-4 rounded-xl border-2 border-gray-100 peer-checked:border-black peer-checked:bg-gray-50 transition-all text-center h-full flex flex-col items-center justify-center capitalize font-semibold">
                                                {method}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            placeholder="Card Number"
                                            className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors"
                                            required
                                            value={cardNumber}
                                            onChange={(e) => /^\d*$/.test(e.target.value) && setCardNumber(e.target.value)}
                                            maxLength={16}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="MM/YY" className="p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors" required />
                                            <input type="text" placeholder="CVC" maxLength={3} className="p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors" required />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <input
                                        type="text"
                                        placeholder="Enter UPI ID (e.g. name@bank)"
                                        className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none transition-colors"
                                        required
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-transform active:scale-[0.98] mt-6 disabled:opacity-50"
                                >
                                    {loading ? 'Processing Order...' : `Pay ₹${Math.round(totalAmount * 1.08).toLocaleString()}`}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Summary Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-3xl sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden mr-3">
                                            {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold truncate w-32">{item.name}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{totalAmount.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm"><span>Tax</span><span>₹{Math.round(totalAmount * 0.08).toLocaleString()}</span></div>
                            <div className="flex justify-between text-xl font-bold mt-4"><span>Total</span><span>₹{Math.round(totalAmount * 1.08).toLocaleString()}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
