"use client";
import CallToActionBanner from "@/components/pages/landing/call-to-action";
import Features from "@/components/pages/landing/features";
import Footer from "@/components/layouts/footers/footer";
import Header from "@/components/layouts/headers/header";
import Hero from "@/components/pages/landing/hero";
import MarketOverview from "@/components/pages/landing/market";
import PartnerLogos from "@/components/pages/landing/supporters";
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { FiArrowUp } from "react-icons/fi";

gsap.registerPlugin(ScrollToPlugin);

const LandingPage: React.FC = () => {
    // Scroll to section if URL contains hash like /#market
    useEffect(() => {
        const hash = window.location.hash?.replace("#", "");
        if (hash) {
            const scrollToEl = () => {
                const el = document.getElementById(hash);
                if (el) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: el, offsetY: 100 },
                        ease: "power2.inOut",
                    });
                }
            };
            setTimeout(scrollToEl, 600); // allow time for GSAP smoother to initialize
        }
    }, []);

    // Back to Top button logic
    const [showTopBtn, setShowTopBtn] = React.useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > 200);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleBackToTop = () => {
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: 0 },
            ease: "power2.inOut",
        });
    };

    return (
        <div className="max-w-[1920px] mx-auto bg-[#f8f9ff] text-black text-[15px]">
            <Header />
            <Hero />
            <MarketOverview />
            <Features />
            <CallToActionBanner />
            <PartnerLogos />
            <Footer />
            {/* Back to Top Button */}
            {showTopBtn && (
                <button
                    onClick={handleBackToTop}
                    className="fixed bottom-8 right-8 z-50 border border-gray-500/30 p-3 rounded-full bg-green-700 text-white shadow-lg hover:bg-green-800 transition-colors"
                    aria-label="Back to top"
                >
                    <FiArrowUp size={24} />
                </button>
            )}
        </div>
    );
};

export default LandingPage;
