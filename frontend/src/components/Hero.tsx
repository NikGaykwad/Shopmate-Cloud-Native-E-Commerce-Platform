import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-primary-dark to-secondary-dark overflow-hidden pt-20">
            {/* Background Texture/Overlay matching reference */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(205,127,50,0.1)_0%,transparent_50%)]"></div>
            </div>

            <div className="relative z-10 text-center max-w-[900px] px-8">
                <h1 className="font-playfair text-[3rem] md:text-[5.5rem] font-extrabold tracking-[2px] mb-6 bg-gradient-to-br from-accent-gold to-[#f4d03f] bg-clip-text text-transparent leading-tight">
                    SHOPMATE
                </h1>
                <div className="font-cormorant text-2xl md:text-[1.8rem] text-text-muted font-light tracking-[4px] mb-8 uppercase">
                    Premium Lifestyle Essentials
                </div>
                <p className="text-text-muted text-lg leading-relaxed mb-12 max-w-[600px] mx-auto hidden md:block">
                    Elevate your daily routine with our exclusive collection of luxury products.
                    Crafted with precision, designed for distinction.
                </p>
                <Link
                    to="/category/electronics"
                    className="inline-block px-12 py-4 bg-gradient-to-br from-accent-gold to-accent-bronze text-primary-dark font-semibold tracking-[2px] rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:translate-y-[-3px] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all duration-300"
                >
                    EXPLORE COLLECTION
                </Link>
            </div>
        </section>
    );
};

export default Hero;
