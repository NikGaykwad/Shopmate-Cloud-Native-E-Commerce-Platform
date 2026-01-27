import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AccountLayout from '../../components/AccountLayout';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

const Orders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return <CheckCircle size={16} className="text-green-600" />;
            case 'shipped': return <Truck size={16} className="text-blue-600" />;
            case 'cancelled': return <XCircle size={16} className="text-red-600" />;
            default: return <Clock size={16} className="text-orange-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    if (loading) return (
        <AccountLayout title="My Orders">
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        </AccountLayout>
    );

    return (
        <AccountLayout title="My Orders">
            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
                    <Link to="/" className="inline-block bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            to={`/account/orders/${order.id}`}
                            key={order.id}
                            className="block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                        >
                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span className="capitalize">{order.status}</span>
                                        </div>
                                        <span className="text-gray-400 text-sm">•</span>
                                        <span className="text-sm text-gray-500">
                                            Ordered on {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-gray-900 font-bold">
                                        Order #{order.id}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Total Amount: <span className="font-medium text-gray-900">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                                    </p>
                                </div>
                                <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                    View Details <ChevronRight size={16} className="ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
};

export default Orders;
