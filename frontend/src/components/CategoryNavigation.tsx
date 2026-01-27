import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Tv, Zap, Shirt, Home, Star, Gamepad2 } from 'lucide-react';

const categories = [
    { name: 'Mobiles', slug: 'mobiles', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'TV & Appliances', slug: 'tv-appliances', icon: Tv, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Electronics', slug: 'electronics', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Fashion', slug: 'fashion', icon: Shirt, color: 'text-pink-600', bg: 'bg-pink-100' },
    { name: 'Home & Kitchen', slug: 'home-kitchen', icon: Home, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Beauty', slug: 'beauty', icon: Star, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Toys', slug: 'toys', icon: Gamepad2, color: 'text-green-600', bg: 'bg-green-100' }
];

const CategoryNavigation = () => {
    const location = useLocation();

    return (
        <div className="bg-white border-b border-gray-100 pt-6 pb-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between md:justify-center md:space-x-12 overflow-x-auto pb-4 hide-scrollbar snap-x">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = location.pathname === `/category/${cat.slug}`;
                        return (
                            <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                className="flex flex-col items-center min-w-[80px] snap-center group"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 shadow-sm ${cat.bg} ${cat.color}`}>
                                    <Icon size={32} strokeWidth={1.5} />
                                </div>
                                <span className={`text-xs font-bold tracking-wide ${isActive ? 'text-black' : 'text-gray-700'}`}>
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CategoryNavigation;
