import CallToActionBanner from "@/components/landing/call-to-action";
import Features from "@/components/landing/features";
import Footer from "@/components/layouts/footers/footer";
import Header from "@/components/layouts/headers/header";
import Hero from "@/components/landing/hero";
import MarketOverview from "@/components/landing/market";
import PartnerLogos from "@/components/landing/supporters";
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="max-w-[1920px] mx-auto bg-[#f8f9ff] text-black text-[15px]">
        <Header />
        <Hero />
        <MarketOverview />
        <Features />
        <CallToActionBanner />
        <PartnerLogos />
        <Footer />
    </div>
  );
};

export default LandingPage;
