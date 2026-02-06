import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Shirt, Home } from 'lucide-react';

const categories = [
    {
        name: 'Mobiles',
        slug: 'mobiles',
        icon: Smartphone,
        color: 'from-blue-400 to-blue-600',
        bgColor: 'bg-blue-50',
        description: 'Latest smartphones'
    },
    {
        name: 'Electronics',
        slug: 'electronics',
        icon: Zap,
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-yellow-50',
        description: 'Tech & gadgets'
    },
    {
        name: 'Fashion',
        slug: 'fashion',
        icon: Shirt,
        color: 'from-pink-400 to-pink-600',
        bgColor: 'bg-pink-50',
        description: 'Trending styles'
    },
    {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        icon: Home,
        color: 'from-orange-400 to-orange-600',
        bgColor: 'bg-orange-50',
        description: 'Home essentials'
    }
];

const TrendingCategories = () => {
    return (
        <section className="py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Categories</h2>
                <p className="text-gray-600">Explore our most popular collections</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                        <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                        >
                            <Link
                                to={`/category/${category.slug}`}
                                className="block group"
                            >
                                <div className={`${category.bgColor} rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:shadow-xl border border-gray-100 relative overflow-hidden`}>
                                    {/* Background gradient on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                                    {/* Icon */}
                                    <div className="relative z-10">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                        </div>

                                        {/* Text */}
                                        <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-1">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 hidden md:block">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default TrendingCategories;
