import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountLayout from '../../components/AccountLayout';
import { Plus, Trash2, Edit2, Check, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

interface Address {
    id: number;
    full_name: string;
    phone_number: string;
    address_line: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    is_default: boolean;
}

const Addresses = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        address_line: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        is_default: false
    });

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/users/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(res.data);
        } catch (error) {
            console.error('Error fetching addresses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const resetForm = () => {
        setFormData({
            full_name: '',
            phone_number: '',
            address_line: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            is_default: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (addr: Address) => {
        setFormData({
            full_name: addr.full_name,
            phone_number: addr.phone_number,
            address_line: addr.address_line,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country,
            is_default: addr.is_default
        });
        setEditingId(addr.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/users/addresses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAddresses();
        } catch (error) {
            console.error('Error deleting address', error);
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/users/addresses/${id}/default`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAddresses();
        } catch (error) {
            console.error('Error setting default address', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingId) {
                await axios.put(`${API_URL}/users/addresses/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/users/addresses`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchAddresses();
            resetForm();
        } catch (error) {
            console.error('Error saving address', error);
        }
    };

    if (loading) return (
        <AccountLayout title="My Addresses">
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        </AccountLayout>
    );

    return (
        <AccountLayout title="My Addresses">
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-6 shadow-md shadow-indigo-100"
                >
                    <Plus size={20} />
                    <span>Add New Address</span>
                </button>
            )}

            {showForm ? (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Address' : 'New Address'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Details</h4>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={formData.phone_number}
                                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Address</h4>
                        </div>
                        <div className="md:col-span-2">
                            <textarea
                                placeholder="Address (House No, Building, Street, Area)"
                                value={formData.address_line}
                                onChange={e => setFormData({ ...formData, address_line: e.target.value })}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="City"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="State"
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Country"
                                value={formData.country}
                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                required
                            />
                        </div>

                        <div className="md:col-span-2 mt-4 flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={formData.is_default}
                                onChange={e => setFormData({ ...formData, is_default: e.target.checked })}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor="is_default" className="text-sm text-gray-700">Make this my default address</label>
                        </div>

                        <div className="md:col-span-2 flex space-x-3 mt-4 pt-4 border-t border-gray-200">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Save Address
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No addresses saved yet</p>
                        </div>
                    ) : (
                        addresses.map((addr) => (
                            <div key={addr.id} className="border border-gray-100 rounded-xl p-5 hover:border-gray-300 transition-colors relative group bg-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-1">
                                            <span className="font-bold text-gray-900">{addr.full_name}</span>
                                            {addr.is_default && (
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-medium">Default</span>
                                            )}
                                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium capitalize">Home</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                            {addr.address_line}, {addr.city}
                                            <br />
                                            {addr.state} - <span className="font-medium text-gray-900">{addr.pincode}</span>
                                        </p>
                                        <p className="text-gray-500 text-sm mt-2">Mobile: <span className="font-medium text-gray-900">{addr.phone_number}</span></p>
                                    </div>

                                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(addr)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {!addr.is_default && (
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="mt-4 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                                    >
                                        <span>Set as default</span>
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </AccountLayout>
    );
};

export default Addresses;
