import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountLayout from '../../components/AccountLayout';
import { User, Phone, Mail } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            setFormData({
                full_name: res.data.full_name || '',
                phone_number: res.data.phone_number || ''
            });
        } catch (error) {
            console.error('Error fetching profile', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user);
            setEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Update local storage user info if name changed
            const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...lsUser, full_name: formData.full_name }));
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    if (loading) return (
        <AccountLayout title="My Profile">
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        </AccountLayout>
    );

    if (!user) return (
        <AccountLayout title="My Profile">
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">Failed to load profile details. Please try logging in again.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                    Retry
                </button>
            </div>
        </AccountLayout>
    );

    return (
        <AccountLayout title="My Profile">
            <div className="max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="text-indigo-600 font-medium hover:text-indigo-800"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {message.text && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone_number}
                                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                                placeholder="+91"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div className="flex space-x-4 pt-2">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setFormData({
                                        full_name: user.full_name,
                                        phone_number: user.phone_number || ''
                                    });
                                }}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="font-medium text-gray-900 mt-0.5">{user.full_name}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Mail className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-medium text-gray-900 mt-0.5">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Phone className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <p className="font-medium text-gray-900 mt-0.5">{user.phone_number || 'Not added'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AccountLayout>
    );
};

export default Profile;
