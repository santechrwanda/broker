import React from "react";
import {
  FaChartLine,
  FaUserShield,
  FaComments,
  FaExchangeAlt,
  FaGlobeAfrica,
  FaFileAlt,
} from "react-icons/fa";

const features = [
  {
    title: "Real-Time Market Insights",
    description: "Stay ahead with up-to-date data and analytics across asset classes and industries.",
    icon: <FaChartLine className="w-12 h-12 mr-6 bg-green-100 p-3 rounded-md shrink-0 text-[#004f64]" />,
  },
  {
    title: "Secure Transactions",
    description: "All trades and listings are protected with industry-grade authentication and compliance standards.",
    icon: <FaUserShield className="w-12 h-12 mr-6 bg-green-100 p-3 rounded-md shrink-0 text-[#004f64]" />,
  },
  {
    title: "Broker–Client Chat",
    description: "Communicate instantly and securely with your broker or client within the platform.",
    icon: <FaComments className="w-12 h-12 mr-6 bg-green-100 p-3 rounded-md shrink-0 text-[#004f64]" />,
  },
  {
    title: "Seamless Listing Management",
    description: "Post, update, and manage listings easily—whether you're a broker or a verified client.",
    icon: <FaExchangeAlt className="w-12 h-12 mr-6 bg-green-100 p-3 rounded-md shrink-0 text-[#004f64]" />,
  },
  {
    title: "Multi-language Support",
    description: "Accessible in Kinyarwanda, English, and French to ensure clarity and inclusiveness for all users.",
    icon: <FaGlobeAfrica className="w-12 h-12 mr-6 bg-green-100 p-3 rounded-md shrink-0 text-[#004f64]" />,
  },
  {
    title: "Smart Document Handling",
    description: "Upload, verify, and manage documents tied to transactions with ease and security.",
    icon: <FaFileAlt className="w-12 h-12 mr-6 bg-green-100 p-3 rounded-md shrink-0 text-[#004f64]" />,
  },
];

const Features: React.FC = () => {
    return (
        <section className="my-32 max-w-7xl px-4 mx-auto">
            <div className="mb-16 max-w-2xl text-center mx-auto">
                <h2 className="md:text-4xl text-[#004f64] text-3xl font-extrabold mb-6">What Makes Us Different</h2>
                <p className="mt-6 text-gray-600">
                    Built for Rwanda and beyond, our platform empowers brokers and clients with the tools to trade smarter,
          communicate better, and grow faster in a transparent, secure ecosystem.
                </p>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 max-md:max-w-lg mx-auto gap-8">
                {features.map((feature, index) => (
                <div
                    key={index}
                    className="sm:p-6 p-4 flex bg-white rounded-md border border-gray-400/30 shadow-[0_14px_40px_-11px_rgba(93,96,127,0.2)]"
                >
                    {feature.icon}
                    <div>
                    <h3 className="text-lg text-gray-600 font-semibold mb-2">{feature.title}</h3>
                    <p>{feature.description}</p>
                    </div>
                </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
