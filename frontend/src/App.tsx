import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User as UserIcon, LogOut } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

import Footer from './components/Footer';

// New Imports
import { CartProvider } from './context/CartContext';
import CategoryNavigation from './components/CategoryNavigation';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import ProductSlider from './components/ProductSlider';
import TrendingCategories from './components/TrendingCategories';
import SearchResults from './pages/SearchResults';

// Account Pages
import Profile from './pages/account/Profile';
import Addresses from './pages/account/Addresses';
import Orders from './pages/account/Orders';
import OrderDetails from './pages/account/OrderDetails';

import Register from './pages/Register';

// API Configuration
const API_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
            window.location.reload();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center h-[80vh]"
        >
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
                </div>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all duration-300"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all duration-300"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </motion.button>
                </form>
                <div className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?
                    <Link to="/register" className="font-bold text-black hover:underline ml-1 transition-colors">Sign Up</Link>
                </div>
            </div>
        </motion.div>
    );
};

const Home = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/products`);
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Hero Section for Premium Feel
    const Hero = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative bg-yellow-400 text-black rounded-3xl overflow-hidden mb-12 mx-4 md:mx-0 shadow-lg border border-yellow-500"
        >
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="relative z-20 p-10 md:p-16 max-w-2xl">
                <span className="inline-block py-1 px-3 rounded-full bg-black text-white text-xs font-bold mb-4 tracking-wider uppercase">New Drops</span>
                <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">Summer Sale Is Live!</h1>
                <p className="text-lg md:text-xl font-medium mb-8 max-w-lg text-gray-900">Grab the hottest tech with up to 40% off. Colors that pop, prices that drop.</p>
                <Link to="/category/electronics">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-black text-yellow-400 px-8 py-3.5 rounded-full font-bold inline-block shadow-lg transition-colors"
                    >
                        Check It Out
                    </motion.button>
                </Link>
            </div>
            <img
                src="https://images.unsplash.com/photo-1593121925328-369cc8459c08?q=80&w=1000&auto=format&fit=crop"
                alt="Colorful Gadgets"
                className="absolute right-[-50px] bottom-[-50px] w-1/2 h-full object-contain hidden md:block rotate-12"
            />
        </motion.div>
    );

    if (loading && products.length === 0) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            <Hero />

            {/* Trending Categories Section */}
            <TrendingCategories />

            {/* Slider 1: Mobiles */}
            <ProductSlider
                title="Latest Mobiles"
                category="mobiles"
                bgColor="bg-blue-50"
            />

            {/* Slider 2: Audio/Electronics */}
            <ProductSlider
                title="Headphones & Accessories"
                category="electronics"
                bgColor="bg-yellow-50"
            />

            {/* Slider 3: TV */}
            <ProductSlider
                title="Smart TVs & Appliances"
                category="tv-appliances"
                bgColor="bg-gray-50"
            />

            {/* Slider 4: Fashion */}
            <ProductSlider
                title="Trending Fashion"
                category="fashion"
                bgColor="bg-pink-50"
            />

            {/* Slider 5: Home */}
            <ProductSlider
                title="Home & Kitchen Essentials"
                category="home-kitchen"
                bgColor="bg-orange-50"
            />

            {/* Slider 6: Beauty */}
            <ProductSlider
                title="Beauty & Grooming"
                category="beauty"
                bgColor="bg-red-50"
            />
        </div>
    );
};

function App() {
    const [user, setUser] = useState<any>(null);
    const location = useLocation();

    useEffect(() => {
        // Check auth status
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Clear search query when navigating to other pages
    useEffect(() => {
        if (!location.pathname.startsWith('/search')) {
            setSearchQuery('');
        }
    }, [location.pathname]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log('Enter pressed, query:', searchQuery);
            if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
        }
    };

    const runSearch = () => {
        console.log('Search button clicked, query:', searchQuery);
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
                {/* Navigation */}
                <nav className="bg-white/80 sticky top-0 z-50 border-b border-gray-100 backdrop-blur-xl transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-3xl font-black tracking-tighter hover:opacity-80 transition-opacity" style={{ fontFamily: "'Inter', sans-serif" }}>Shopmate.</Link>

                            {/* Search Bar - hidden on mobile */}
                            <div className="hidden md:flex flex-1 max-w-md mx-12 relative group">
                                <input
                                    type="text"
                                    placeholder="Search query..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full bg-gray-100/50 border border-transparent rounded-full py-2.5 px-12 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 outline-none transition-all duration-300 text-sm shadow-sm hover:shadow-md"
                                />
                                <button
                                    onClick={runSearch}
                                    className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors bg-transparent border-none cursor-pointer"
                                    aria-label="Search"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex items-center space-x-6">
                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        <Link to="/account/profile" className="flex items-center space-x-2 text-sm font-medium hover:text-black transition-colors group">
                                            <UserIcon className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                                            <span className="hidden sm:inline">Hi, {user.full_name?.split(' ')[0] || 'User'}</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <Link to="/login" className="flex items-center space-x-2 text-sm font-medium hover:text-black transition-colors">
                                        <UserIcon className="h-6 w-6" />
                                        <span className="hidden sm:inline">Account</span>
                                    </Link>
                                )}

                                <Link to="/cart" className="relative cursor-pointer hover:text-black transition-colors group">
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <ShoppingCart className="h-6 w-6" />
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <CategoryNavigation />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/product/:id" element={<ProductDetails />} />

                        {/* Account Routes */}
                        <Route path="/account/profile" element={<Profile />} />
                        <Route path="/account/addresses" element={<Addresses />} />
                        <Route path="/account/orders" element={<Orders />} />
                        <Route path="/account/orders/:id" element={<OrderDetails />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </CartProvider>
    )
}

export default App;
