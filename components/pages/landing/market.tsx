import React from "react";

const marketData = [
    {
        name: "Equity Group Holdings",
        security: "EQTY",
        price: 47.5,
        quantity: 1200,
    },
    {
        name: "MTN Rwanda",
        security: "MTNR",
        price: 282.0,
        quantity: 830,
    },
    {
        name: "Bank of Kigali",
        security: "BK",
        price: 275.0,
        quantity: 600,
    },
];

const MarketOverview: React.FC = () => {
    return (
        <section
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
            id="market"
        >
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-[#004f64]">
                    Market Snapshot
                </h2>
                <p className="mt-4 text-gray-600">
                    Live market data to help you make informed decisions.
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 shadow-sm border border-gray-200 rounded-md">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Security
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Market Price (RWF)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {marketData.map((stock, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                    {stock.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    {stock.security}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-green-700 font-semibold">
                                    {stock.price.toLocaleString()} RWF
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    {stock.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default MarketOverview;
