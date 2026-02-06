import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-black tracking-tighter mb-4">Shopmate.</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Your premium destination for tech and lifestyle products. Quality guaranteed on every purchase.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/category/electronics" className="hover:text-black transition-colors">Electronics</Link></li>
                            <li><Link to="/category/mobiles" className="hover:text-black transition-colors">Mobiles</Link></li>
                            <li><Link to="/category/laptops" className="hover:text-black transition-colors">Laptops</Link></li>
                            <li><Link to="/category/audio" className="hover:text-black transition-colors">Audio</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="#" className="hover:text-black transition-colors">Contact Us</Link></li>
                            <li><Link to="#" className="hover:text-black transition-colors">FAQs</Link></li>
                            <li><Link to="#" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="#" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Stay Connected</h4>
                        <p className="text-gray-500 text-sm mb-4">Subscribe for latest updates and offers.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white border border-gray-300 rounded-l-lg px-4 py-2 w-full text-sm focus:outline-none focus:border-black transition-colors"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-black text-white px-4 py-2 rounded-r-lg text-sm font-bold"
                            >
                                Join
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Shopmate Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
