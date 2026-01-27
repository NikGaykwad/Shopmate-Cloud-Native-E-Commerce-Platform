import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AccountLayout from '../../components/AccountLayout';
import { ArrowLeft, Package, MapPin, CreditCard, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(res.data);
            } catch (error) {
                console.error('Error fetching order details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    if (loading) return (
        <AccountLayout title="Order Details">
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        </AccountLayout>
    );

    if (!order) return (
        <AccountLayout title="Order Details">
            <div className="text-center py-10">
                <p>Order not found</p>
                <Link to="/account/orders" className="text-indigo-600 hover:underline mt-2 inline-block">Back to Orders</Link>
            </div>
        </AccountLayout>
    );

    // Parse JSON headers if they come as strings (depends on DB driver behavior sometimes)
    const shippingAddress = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;
    const paymentInfo = typeof order.payment_info === 'string' ? JSON.parse(order.payment_info) : order.payment_info;

    return (
        <AccountLayout title={`Order #${order.id}`}>
            <div className="mb-6">
                <Link to="/account/orders" className="flex items-center text-sm text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Orders
                </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Placed on</p>
                        <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-900">#{order.id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold text-gray-900 text-lg">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg text-gray-900">Items Ordered</h3>
                    <div className="space-y-4">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex bg-white border border-gray-100 p-4 rounded-xl">
                                <div className="h-24 w-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center p-2">
                                    {item.product?.images?.[0] ? (
                                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Package className="text-gray-300" />
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <h4 className="font-medium text-gray-900 line-clamp-2">{item.product?.name || 'Unknown Product'}</h4>
                                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                    <p className="font-bold text-gray-900 mt-2">₹{parseFloat(item.price_at_purchase).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <MapPin size={18} className="mr-2 text-gray-500" /> Shipping Address
                        </h3>
                        {shippingAddress ? (
                            <div className="text-sm text-gray-600 leading-relaxed">
                                <p className="font-semibold text-gray-900 mb-1">{shippingAddress.full_name}</p>
                                <p>{shippingAddress.address_line}</p>
                                <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                                <p>{shippingAddress.country}</p>
                                <p className="mt-2">Phone: {shippingAddress.phone_number}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Address info unavailable</p>
                        )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <CreditCard size={18} className="mr-2 text-gray-500" /> Payment Info
                        </h3>
                        {paymentInfo ? (
                            <div className="text-sm text-gray-600">
                                <p><span className="text-gray-500">Method:</span> <span className="font-medium text-gray-900 capitalize">{paymentInfo.method}</span></p>
                                <p className="mt-1"><span className="text-gray-500">Status:</span> <span className="text-green-600 font-medium capitalize">Paid</span></p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Payment info unavailable</p>
                        )}
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
};

export default OrderDetails;
