import Link from "next/link";
import React from "react";

const Footer: React.FC = () => (
    <footer
        className="bg-white pt-12 shadow-[0_-6px_12px_-6px_rgba(0,0,0,0.1)]"
        id="about-us"
    >
        <div className="grid max-sm:grid-cols-1 px-4 sm:px-10 max-lg:grid-cols-2 lg:grid-cols-5 lg:gap-14 max-lg:gap-8">
            <div className="lg:col-span-2">
                <h4 className="text-xl font-semibold mb-6 text-[#004f64]">
                    About Us
                </h4>
                <p className="text-gray-700">
                    Stock Broker is a digital brokerage platform that empowers
                    clients and brokers to connect, trade, and grow through
                    secure, transparent, and efficient tools. Our mission is to
                    make asset trading accessible and trustworthy for
                    everyone—from individuals to institutions.
                </p>
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-6 text-[#004f64]">
                    Services
                </h4>
                <ul className="space-y-5 text-gray-700">
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Asset Listings
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Commission Tracking
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Broker–Client Messaging
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Market Insights
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-6 text-[#004f64]">
                    Resources
                </h4>
                <ul className="space-y-5 text-gray-700">
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Getting Started Guide
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Frequently Asked Questions
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Security & Compliance
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Legal & Privacy
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <h4
                    className="text-xl font-semibold mb-6 text-[#004f64]"
                    id="contact-us"
                >
                    Contact Us
                </h4>
                <ul className="space-y-5 text-gray-700">
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Support Center
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Email: haki77ssu@yahoo.com
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Phone: +1 (502) 650-2191
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-green-700">
                            Location: Kigali, Rwanda
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <section className="bg-[#004f64] mt-5">
            <p className="text-center py-5  text-sm text-white border-t border-white/30">
                © {new Date().getFullYear()}{" "}
                <span className="mx-1 font-medium text-white">
                    Stock Broker
                </span>{" "}
                — All Rights Reserved, Developed by{" "}
                <Link
                    href="https://www.santechrwanda.com"
                    target="_blank"
                    className="hover:underline"
                >
                    SAN TECH
                </Link>
            </p>
        </section>
    </footer>
);

export default Footer;
