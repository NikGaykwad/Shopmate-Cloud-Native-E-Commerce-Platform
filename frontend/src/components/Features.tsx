import React from 'react';

const Features = () => {
    return (
        <section className="py-32 px-6 max-w-[1400px] mx-auto">
            <h2 className="font-playfair text-center text-[3.5rem] mb-4 text-accent-gold">Why Choose Shopmate</h2>
            <p className="text-center text-text-muted text-[1.1rem] mb-20 tracking-[2px] uppercase">EXCELLENCE IN EVERY DETAIL</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="bg-secondary-dark p-12 rounded-[15px] text-center border border-accent-gold/10 hover:-translate-y-2 hover:border-accent-gold/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-default">
                    <div className="text-[3rem] mb-6">🌿</div>
                    <h3 className="font-playfair text-[1.8rem] mb-4 text-accent-gold">Quality Selection</h3>
                    <p className="text-text-muted leading-relaxed">
                        Carefully curated collection of premium tech and lifestyle essentials.
                    </p>
                </div>

                <div className="bg-secondary-dark p-12 rounded-[15px] text-center border border-accent-gold/10 hover:-translate-y-2 hover:border-accent-gold/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-default">
                    <div className="text-[3rem] mb-6">⚗️</div>
                    <h3 className="font-playfair text-[1.8rem] mb-4 text-accent-gold">Expert Verified</h3>
                    <p className="text-text-muted leading-relaxed">
                        Tested and approved by industry experts for maximum performance.
                    </p>
                </div>

                <div className="bg-secondary-dark p-12 rounded-[15px] text-center border border-accent-gold/10 hover:-translate-y-2 hover:border-accent-gold/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-default">
                    <div className="text-[3rem] mb-6">✨</div>
                    <h3 className="font-playfair text-[1.8rem] mb-4 text-accent-gold">Luxury Experience</h3>
                    <p className="text-text-muted leading-relaxed">
                        Transform your daily routine into a sophisticated ritual with our products.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Features;
