import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User as UserIcon, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [user, setUser] = useState<any>(null);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Check auth status
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u));
        }
    }, [location]); // Re-check on location change (login/logout simulation)

    return (
        <nav className="fixed w-full top-0 z-[1000] bg-primary-dark/95 backdrop-blur-md border-b border-accent-gold/10 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-playfair text-3xl font-bold tracking-[3px] text-accent-gold hover:text-white transition-colors duration-300">
                    SHOPMATE
                </Link>

                {/* Desktop Links & Actions */}
                <div className="hidden md:flex items-center gap-12">
                    <ul className="flex gap-8 list-none">
                        <li>
                            <Link to="/" className="text-text-light font-medium text-[0.95rem] tracking-widest relative group transition-colors duration-300 hover:text-accent-gold">
                                HOME
                                <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/category/electronics" className="text-text-light font-medium text-[0.95rem] tracking-widest relative group transition-colors duration-300 hover:text-accent-gold">
                                PRODUCTS
                                <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    </ul>

                    {/* Search - Styled to match theme */}
                    <div className="relative group hidden lg:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-secondary-dark/50 border border-accent-gold/20 rounded-full py-2 px-10 text-text-light text-sm focus:outline-none focus:border-accent-gold/50 transition-all w-48 focus:w-64"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted group-focus-within:text-accent-gold transition-colors" />
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-6 text-text-light">
                        {user ? (
                            <Link to="/account/profile" className="flex items-center gap-2 hover:text-accent-gold transition-colors group">
                                <UserIcon className="h-5 w-5" />
                                <span className="hidden lg:inline text-sm font-medium tracking-wide">Hi, {user.full_name?.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 hover:text-accent-gold transition-colors">
                                <UserIcon className="h-5 w-5" />
                            </Link>
                        )}

                        <Link to="/cart" className="hover:text-accent-gold transition-colors relative">
                            <ShoppingCart className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-text-light hover:text-accent-gold" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-primary-dark border-t border-accent-gold/10 absolute w-full px-6 py-4 flex flex-col gap-4 shadow-xl">
                    <Link to="/" className="text-text-light hover:text-accent-gold text-sm tracking-widest" onClick={() => setIsMenuOpen(false)}>HOME</Link>
                    <Link to="/category/electronics" className="text-text-light hover:text-accent-gold text-sm tracking-widest" onClick={() => setIsMenuOpen(false)}>PRODUCTS</Link>
                    <div className="h-[1px] bg-white/10 my-2"></div>
                    <Link to={user ? "/account/profile" : "/login"} className="text-text-light hover:text-accent-gold text-sm tracking-widest flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <UserIcon className="h-4 w-4" /> {user ? "ACCOUNT" : "LOGIN"}
                    </Link>
                    <Link to="/cart" className="text-text-light hover:text-accent-gold text-sm tracking-widest flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <ShoppingCart className="h-4 w-4" /> CART
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
