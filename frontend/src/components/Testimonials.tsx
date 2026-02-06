import React from 'react';

const Testimonials = () => {
    return (
        <section className="py-32 px-6 max-w-[1200px] mx-auto">
            <h2 className="font-playfair text-center text-[3.5rem] mb-4 text-accent-gold">What Our Clients Say</h2>
            <p className="text-center text-text-muted text-[1.1rem] mb-20 tracking-[2px] uppercase">TESTIMONIALS</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                <div className="bg-secondary-dark p-12 rounded-[15px] border-l-4 border-accent-gold hover:bg-[#333] transition-colors duration-300">
                    <p className="font-cormorant text-[1.3rem] leading-relaxed text-text-muted mb-8 italic">
                        "Shopmate has completely transformed my shopping experience. The quality is unmatched, and the results speak for themselves."
                    </p>
                    <div className="font-semibold text-text-light">Marcus Wellington</div>
                    <div className="text-text-muted text-sm">Executive Director</div>
                </div>

                <div className="bg-secondary-dark p-12 rounded-[15px] border-l-4 border-accent-gold hover:bg-[#333] transition-colors duration-300">
                    <p className="font-cormorant text-[1.3rem] leading-relaxed text-text-muted mb-8 italic">
                        "Finally, a brand that understands luxury and effectiveness. The attention to detail is extraordinary."
                    </p>
                    <div className="font-semibold text-text-light">James Thornton</div>
                    <div className="text-text-muted text-sm">Entrepreneur</div>
                </div>

                <div className="bg-secondary-dark p-12 rounded-[15px] border-l-4 border-accent-gold hover:bg-[#333] transition-colors duration-300">
                    <p className="font-cormorant text-[1.3rem] leading-relaxed text-text-muted mb-8 italic">
                        "Premium products that deliver on their promise. Delivery was swift and the packaging was exquisite."
                    </p>
                    <div className="font-semibold text-text-light">David Chen</div>
                    <div className="text-text-muted text-sm">Art Director</div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
