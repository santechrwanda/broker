"use client";
import CallToActionBanner from "@/components/landing/call-to-action";
import Features from "@/components/landing/features";
import Footer from "@/components/layouts/footers/footer";
import Header from "@/components/layouts/headers/header";
import Hero from "@/components/landing/hero";
import MarketOverview from "@/components/landing/market";
import PartnerLogos from "@/components/landing/supporters";
import React from "react";
import useScrollSmoother from "@/hooks/use-scroll-smoother";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);


const LandingPage: React.FC = () => {
  useScrollSmoother();

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
