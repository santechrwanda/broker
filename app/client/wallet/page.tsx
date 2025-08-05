"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import {
    FaBitcoin,
    FaEthereum,
} from 'react-icons/fa';
import {
    SiLitecoin,
    SiDash,
    SiMonero,
    SiRipple,
} from 'react-icons/si';
import {
    IoTrendingUp,
    IoTrendingDown,
    IoSettingsSharp,
    IoAdd,
    IoEyeSharp,
    IoChevronBack,
    IoChevronForward,
} from 'react-icons/io5';
import {
    MdMoreHoriz,
    MdAccountBalanceWallet,
} from 'react-icons/md';
import { BiDollar } from 'react-icons/bi';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiEye } from 'react-icons/fi';
import DepositFundsModal from '@/components/pages/funds/add-funds-modal';
import { useGetHoldingsQuery } from '@/hooks/use-holdings';
import Image from 'next/image';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const CryptoWalletDashboard = () => {
    const [marketView, setMarketView] = useState('Today');
    const chartRef = useRef(null);
    const watchlistRef = useRef<HTMLDivElement>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

    // Watchlist data
    const watchlistData = [
        { icon: FaBitcoin, name: 'Bitcoin', price: 46335.40, change: -1.92, color: '#F7931A' },
        { icon: SiLitecoin, name: 'Litecoin', price: 65.64, change: 16.38, color: '#BFBBBB' },
        { icon: FaEthereum, name: 'Ethereum', price: 3748.66, change: 0.36, color: '#627EEA' },
        { icon: SiMonero, name: 'Monero', price: 226.55, change: -1.92, color: '#FF6600' },
        { icon: SiDash, name: 'Dash', price: 142.5, change: 16.38, color: '#008CE7' },
        { icon: SiRipple, name: 'Maker', price: 2390.75, change: 0.36, color: '#00D4AA' },
    ];

    // Real holdings
    const { data: holdings = [], isLoading: isHoldingsLoading, isError: isHoldingsError } = useGetHoldingsQuery();

    // Duplicate items for seamless looping
    const duplicatedWatchlist = [...watchlistData, ...watchlistData, ...watchlistData];

    useEffect(() => {
        const container = containerRef.current;
        const watchlist = watchlistRef.current;

        if (!container || !watchlist) return;

        const cards = Array.from(watchlist.children) as HTMLElement[];
        if (cards.length === 0) return;

        const cardWidth = cards[0].offsetWidth;
        const gap = 16; // gap-4 = 16px
        const totalWidth = (cardWidth + gap) * watchlistData.length;

        // Set initial position to the middle of the duplicated content
        gsap.set(watchlist, { x: -totalWidth });

        // Create infinite scroll animation
        const animation = gsap.to(watchlist, {
            x: `+=${totalWidth}`,
            duration: 40,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => {
                    const xNum = parseFloat(x);
                    return ((xNum % totalWidth) + totalWidth) % totalWidth - totalWidth;
                })
            }
        });

        // Pause on hover
        const pauseOnHover = () => {
            container.addEventListener('mouseenter', () => animation.pause());
            container.addEventListener('mouseleave', () => animation.resume());
        };

        pauseOnHover();

        return () => {
            animation.kill();
            container.removeEventListener('mouseenter', () => animation.pause());
            container.removeEventListener('mouseleave', () => animation.resume());
        };
    }, [watchlistData.length]);

    // Manual navigation handlers
    const navigate = (direction: 'prev' | 'next') => {
        const watchlist = watchlistRef.current;
        if (!watchlist) return;

        const cards = Array.from(watchlist.children) as HTMLElement[];
        if (cards.length === 0) return;

        const cardWidth = cards[0].offsetWidth;
        const gap = 16; // gap-4 = 16px
        const scrollAmount = (cardWidth + gap) * 3; // Scroll 3 cards at a time

        gsap.to(watchlist, {
            x: `+=${direction === 'next' ? -scrollAmount : scrollAmount}`,
            duration: 0.5,
            ease: "power2.out",
            modifiers: {
                x: gsap.utils.unitize(x => {
                    const xNum = parseFloat(x);
                    const totalWidth = (cardWidth + gap) * watchlistData.length;
                    return ((xNum % totalWidth) + totalWidth) % totalWidth - totalWidth;
                })
            }
        });
    };

    // Drag to scroll functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
        setScrollLeft(watchlistRef.current?.scrollLeft || 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current || !watchlistRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scroll speed
        watchlistRef.current.scrollLeft = scrollLeft - walk;
    };


    const getCryptoIcon = (IconComponent: any, color: string) => (
        <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
            <IconComponent className="w-5 h-5" style={{ color }} />
        </div>
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatCompactCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(2)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return formatCurrency(amount);
    };

    // Fix for chart not showing - ensure dynamic import in production
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('chart.js').then(() => {
                if (chartRef.current) {
                    (chartRef.current as any).update();
                }
            });
        }
    }, []);

    return (
        <div className="min-h-screen">

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Portfolio Statistics */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Watchlist */}
                    <div className="bg-white rounded-md shadow-sm p-6 border border-gray-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                            <h3 className="text-xl font-semibold text-gray-800">My Watchlist</h3>
                        </div>

                        <div className="relative">
                            {/* Navigation Arrows */}
                            <button
                                onClick={() => navigate('prev')}
                                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors`}
                            >
                                <IoChevronBack className="w-6 h-6 text-gray-700" />
                            </button>

                            <button
                                onClick={() => navigate('next')}
                                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors`}
                            >
                                <IoChevronForward className="w-6 h-6 text-gray-700" />
                            </button>

                            {/* Watchlist Container */}
                            <div
                                ref={containerRef}
                                className="relative overflow-hidden"
                                onMouseDown={handleMouseDown}
                                onMouseLeave={handleMouseLeave}
                                onMouseUp={handleMouseUp}
                                onMouseMove={handleMouseMove}
                            >
                                <div
                                    ref={watchlistRef}
                                    className="flex gap-4 select-none"
                                >
                                    {duplicatedWatchlist.map((crypto, index) => (
                                        <div
                                            key={`${crypto.name}-${index}`}
                                            className="flex-shrink-0 w-full sm:w-1/2 md:w-1/4"
                                        >
                                            <div className="bg-gray-100 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer h-full">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        {getCryptoIcon(crypto.icon, crypto.color)}
                                                        <span className="font-medium text-gray-800">{crypto.name}</span>
                                                    </div>
                                                    <MdMoreHoriz className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(crypto.price)}</p>
                                                    <div className={`flex items-center gap-1 text-sm ${crypto.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        {crypto.change >= 0 ? (
                                                            <IoTrendingUp className="w-4 h-4" />
                                                        ) : (
                                                            <IoTrendingDown className="w-4 h-4" />
                                                        )}
                                                        {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Slide Indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            {Array.from({ length: Math.max(1, watchlistData.length - 2) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Market Status */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                            <h3 className="text-xl font-semibold text-gray-800">My Holdings</h3>
                            <div className="flex bg-gray-100 border border-gray-100 rounded-lg p-1 w-full md:w-auto">
                                <button
                                    onClick={() => setMarketView('Today')}
                                    className={`px-4 py-2 text-sm rounded transition-colors flex-1 md:flex-none ${marketView === 'Today' ? 'bg-primary text-white' : 'text-gray-600 cursor-pointer'
                                        }`}
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setMarketView('Overall')}
                                    className={`px-4 py-2 text-sm rounded transition-colors flex-1 md:flex-none ${marketView === 'Overall' ? 'bg-primary text-white' : 'text-gray-600 cursor-pointer'
                                        }`}
                                >
                                    Overall
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 text-sm font-medium text-gray-500">Asset</th>
                                        <th className="text-left py-3 text-sm font-medium text-gray-500">Price</th>
                                        <th className="text-left py-3 text-sm font-medium text-gray-500">Change</th>
                                        <th className="text-left py-3 text-sm font-medium text-gray-500">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isHoldingsLoading ? (
                                        <tr><td colSpan={4} className="py-8 text-center text-gray-500">Loading holdings...</td></tr>
                                    ) : isHoldingsError ? (
                                        <tr><td colSpan={4} className="py-8 text-center text-red-500">Failed to load holdings.</td></tr>
                                    ) : !holdings || holdings.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8">
                                                <div className="flex flex-col items-center justify-center w-full h-full">
                                                    <Image src="/images/no_data.svg" alt="No items" width={100} height={100} />
                                                    <div className="py-2 text-center text-gray-500">No holdings found.</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        holdings.map((holding, index) => {
                                            // No icon/color for real holdings, so just show symbol
                                            // You can enhance this by mapping symbol to icon/color if needed
                                            const currentPrice = holding.averagePurchasePrice; // You may fetch live price if available
                                            const value = holding.sharesOwned * currentPrice;
                                            const investment = holding.sharesOwned * holding.averagePurchasePrice;
                                            const profit = value - investment;
                                            const profitPercent = investment !== 0 ? (profit / investment) * 100 : 0;
                                            return (
                                                <tr key={holding.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="py-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="font-medium text-gray-800 block">{holding.security}</div>
                                                            <span className="text-gray-500 text-sm">{holding.sharesOwned} shares</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 text-gray-600 font-medium">{formatCurrency(currentPrice)}</td>
                                                    <td className="py-2">
                                                        <div className={`flex items-center gap-1 ${profitPercent >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            {profitPercent >= 0 ? (
                                                                <IoTrendingUp className="w-4 h-4" />
                                                            ) : (
                                                                <IoTrendingDown className="w-4 h-4" />
                                                            )}
                                                            {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                                                        </div>
                                                    </td>
                                                    <td className="py-2 text-gray-800 font-medium">{formatCurrency(value)}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {holdings?.length > 0 && <div className="flex justify-end items-center gap-2 mt-6">
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">Previous</button>
                            <button className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-title transition-colors">1</button>
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">2</button>
                            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">Next</button>
                        </div>}
                    </div>
                </div>
            </div>
            {/* Add Funds Modal */}
            <DepositFundsModal
                isOpen={isAddFundsOpen}
                onClose={() => setIsAddFundsOpen(false)}
            />
        </div>
    );
};

export default CryptoWalletDashboard;