"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const images = [
  { src: "/images/broker.png", alt: "Register as a Broker" },
  { src: "/images/savings.png", alt: "Savings" },
  { src: "/images/buy_shares.png", alt: "Buy Share" },
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInitial = useRef(true); // to skip animation on first render

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const animateOutAndNext = (index: number) => {
      const currentEl = imageRefs.current[index];

      if (!currentEl) return;

      // Animate current image out
      gsap.to(currentEl, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          const next = (index + 1) % images.length;
          setCurrent(next); // triggers re-render and effect below

          // Animate next image in after short delay (can also do inside next effect)
          timeoutId = setTimeout(() => {
            animateOutAndNext(next);
          }, 5000); // wait time between full transitions
        },
      });
    };

    if (isInitial.current) {
      isInitial.current = false;

      // Animate first image in (no need to fade out)
      const first = imageRefs.current[0];
      if (first) {
        gsap.fromTo(
          first,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 }
        );
      }

      // Kick off loop after 5s
      timeoutId = setTimeout(() => {
        animateOutAndNext(0);
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // Animate new image in on `current` update
    const newEl = imageRefs.current[current];
    if (newEl) {
      gsap.fromTo(
        newEl,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 }
      );
    }
  }, [current]);

  return (
    <section className="relative h-[calc(100vh-5rem)] mt-1 overflow-hidden mb-16 shadow-md">
      {/* Slideshow at bottom layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-end bg-white">
        {images.map((img, idx) => (
          <div
            key={img.src}
            ref={(el) => { imageRefs.current[idx] = el; }}
            style={{
              position: "absolute",
              top: 80,
              right: 0,
              opacity: idx === current ? 1 : 0,
              zIndex: idx === current ? 2 : 1,
              transform: "translateX(0)",
              transition: "opacity 0.3s",
            }}
            className="w-[355px] h-[225px] md:w-[710px] md:h-[450px] flex items-center justify-center"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={710}
              height={450}
              className="object-contain"
              priority={idx === current}
            />
          </div>
        ))}
      </div>

      {/* Background image in the middle */}
      <Image
        src="/images/hero_image.svg"
        alt=""
        fill
        className="object-cover object-left w-full h-full pointer-events-none select-none"
        style={{ zIndex: 10 }}
        priority
      />

      {/* Content on top */}
      <div className="relative z-20 flex w-full flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 md:py-20 text-white">
        <div className="flex-1 md:pr-12 max-w-xl text-center md:text-left">
          <h1 className="md:text-6xl text-4xl font-extrabold mb-6 md:!leading-[75px]">
            <span className="text-white">One platform</span><br />
            <span className="text-white/90">all things <span className="font-bold text-white">Stocks</span></span>
          </h1>
          <p className="text-white/80 mt-4 text-base md:text-lg max-w-2xl">
            Step into the world of trading excellence and seize every opportunity with our advanced platform,
            expert guidance, and strategic insights for unrivaled financial success.
          </p>
          <div className="flex justify-center md:justify-start items-center flex-wrap gap-6 mt-6 text-sm text-white/80">
            <div className="flex items-center gap-2"><span>⚡</span><span>Fast Trading</span></div>
            <div className="flex items-center gap-2"><span>🔒</span><span>Secure & Reliable</span></div>
            <div className="flex items-center gap-2"><span>🔄</span><span>Continuous Market Updates</span></div>
          </div>
          <div className="mt-8">
            <button className="bg-gradient-to-r from-white to-[#c6e4ec] text-[#004f64] px-8 py-3 rounded-full font-semibold shadow-md hover:from-[#e6f9ff] hover:to-white transition">
              🔥 Start Trading Now!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;