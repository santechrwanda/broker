import React from "react";
import Image from "next/image";

const CallToActionBanner: React.FC = () => (
  <section className="bg-[#004f64] rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between my-16 shadow-md">
    <div className="flex-1 md:pr-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
        Join Rwanda’s Smartest Trading Platform
      </h2>
      <p className="text-lg text-blue-100 mb-8">
        Whether you&apos;re buying shares or browsing investment opportunities, Stock Broker connects you to
        trusted brokers and real-time market insights. Register today and take control of your financial future with confidence.
      </p>
      <a
        href="/register"
        className="inline-block bg-white text-[#004f64] font-semibold px-8 py-4 rounded-lg shadow hover:bg-blue-100 hover:text-[#004f64] transition"
      >
        Create an account
      </a>
    </div>
    <div className="flex-1 mt-10 md:mt-0 flex justify-center">
      <Image
        src="/images/shares.svg"
        alt="Client Trading Dashboard"
        width={420}
        height={320}
        className="rounded-xl shadow-lg object-cover"
        priority
      />
    </div>
  </section>
);

export default CallToActionBanner;
