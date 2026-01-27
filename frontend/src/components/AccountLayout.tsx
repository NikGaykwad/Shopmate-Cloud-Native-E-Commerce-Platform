import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, MapPin, Package, LogOut } from 'lucide-react';

interface AccountLayoutProps {
    children: React.ReactNode;
    title: string;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children, title }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'My Profile', path: '/account/profile', icon: User },
        { name: 'My Addresses', path: '/account/addresses', icon: MapPin },
        { name: 'My Orders', path: '/account/orders', icon: Package },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">Account Menu</h2>
                        </div>
                        <nav className="p-2 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)
                                                ? 'bg-black text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}

                            <hr className="my-2 border-gray-100" />

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountLayout;
