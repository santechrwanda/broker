"use client"
import { FiTrendingUp, FiDollarSign, FiPieChart, FiBarChart2, FiCreditCard, FiPlus } from 'react-icons/fi';
import { RiCoinsLine } from 'react-icons/ri';
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
import { useState } from 'react';
import { useGetMyTransactionsQuery } from '@/hooks/use-transaction';
import DepositFundsModal from '@/components/pages/funds/add-funds-modal';
import WithdrawFundsModal from '@/components/pages/funds/withdraw-funds-modal';
import Link from 'next/link';
import { useGetWatchlistQuery } from '@/hooks/use-watchlist';
import { useGetMarketDataQuery } from '@/hooks/use-market';
import Image from 'next/image';
import { useGetHoldingsQuery } from '@/hooks/use-holdings';

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

const InvestmentDashboard = () => {
  // Mock data - in a real app this would come from API calls
  const portfolioValue = 38942.75;
  const portfolioChange = 2.45;
  const changeAmount = 932.18;
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isWithdrawFundsOpen, setIsWithdrawFundsOpen] = useState(false);

  // Chart data matching the image style
  const chartData = {
    labels: ['Mar 12', 'Apr 12', 'May 12', 'Jun 12', 'Jul 12', 'Aug 12', 'Sep 12', 'Oct 12', 'Nov 12', 'Dec 12', '2013', 'Feb 13'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [33200, 34500, 33800, 32100, 30800, 31500, 33900, 32800, 34200, 33500, 35800, 38942.75],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        tension: 0.1,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: "index" as const,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        min: 28000,
        max: 40000,
      },
    },
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      line: {
        tension: 0.1,
      },
    },
  };


  // Fetch user's watchlist and all market data
  const { data: watchlistData = [], isLoading: isWatchlistLoading, isError: isWatchlistError } = useGetWatchlistQuery();
  const { data: marketData = [], isLoading: isMarketLoading, isError: isMarketError } = useGetMarketDataQuery({});

  // Map watchlist marketIds to market data
  const watchlist = watchlistData
    .map((item) => {
      const market = marketData.find((m) => m.id === item.marketId);
      if (!market) return null;
      return {
        symbol: market.security,
        name: market.security, // If you have a name field, use it; else fallback to symbol
        price: market.closing,
        change: market.change,
      };
    })
    .filter(Boolean);


  // Fetch real holdings
  const { data: holdings = [], isLoading: isHoldingsLoading, isError: isHoldingsError } = useGetHoldingsQuery();

  // Fetch real recent transactions
  const { data: recentTransactions = [], isLoading: isTxLoading, isError: isTxError } = useGetMyTransactionsQuery({});

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-2xl font-bold text-gray-600">Investment Portfolio</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your investment overview.</p>
        </div>
        <button onClick={() => setIsAddFundsOpen(true)} className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-[#004f64] text-white px-4 py-2 rounded-lg transition-colors">
          <FiPlus className="w-5 h-5" />
          <span>Add Funds</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Portfolio Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <p className="text-3xl font-bold text-title">${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <div className={`flex items-center mt-1 ${portfolioChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <FiTrendingUp className={`w-4 h-4 mr-1 ${portfolioChange < 0 && 'transform rotate-180'}`} />
                <span className="text-sm font-medium">▲ ${changeAmount.toFixed(2)} ({Math.abs(portfolioChange)}%) Today</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <FiPieChart className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Chart container */}
          <div className="h-64 mb-4">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Time period selector */}
          <div className="flex space-x-2">
            {['LIVE', '1D', '1W', '1M', '3M', 'YTD', '1Y', 'ALL'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${period === '1Y'
                  ? 'bg-blue-100 text-primary font-medium'
                  : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-600 text-center mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => setIsAddFundsOpen(true)} className="w-full cursor-pointer flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-green-100 rounded-full">
                <FiDollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium">Deposit Funds</span>
            </button>
            <button onClick={() => setIsWithdrawFundsOpen(true)} className="w-full flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-blue-100 rounded-full">
                <FiCreditCard className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Withdraw Funds</span>
            </button>
            <Link href="/client/market" className="w-full flex items-center cursor-pointer gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 bg-purple-100 rounded-full">
                <RiCoinsLine className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-medium">Buy Shares and Bonds</span>
            </Link>
          </div>
        </div>

        {/* Add Funds Modal */}
        <DepositFundsModal
          isOpen={isAddFundsOpen}
          onClose={() => setIsAddFundsOpen(false)}
        />

        <WithdrawFundsModal
          isOpen={isWithdrawFundsOpen}
          onClose={() => setIsWithdrawFundsOpen(false)}
          walletBalance={120}
        />
      </div>

      {/* Market Data and Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Watchlist */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-center text-gray-600 mb-4">My Watchlist</h3>
          <div className="space-y-4 h-full">
            {isWatchlistLoading || isMarketLoading ? (
              <div className="py-8 text-center text-gray-500">Loading watchlist...</div>
            ) : isWatchlistError || isMarketError ? (
              <div className="py-8 text-center text-red-500">Failed to load watchlist.</div>
            ) : watchlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <Image src="/images/no_data.svg" alt="No items" width={100} height={100} />
                <div className="py-2 text-center text-gray-500">No items in your watchlist.</div>
              </div> 
            ) : (
              watchlist?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium">{item?.symbol}</p>
                    <p className="text-sm text-gray-500">{item?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(item?.price)?.toFixed(2)}</p>
                    <p className={`text-sm ${Number(item?.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(item?.change) >= 0 ? '+' : ''}{Number(item?.change)?.toFixed(2)}
                      {item?.price && item?.change ? ` (${((item?.change / (item?.price - item?.change)) * 100).toFixed(2)}%)` : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          {watchlist && watchlist?.length > 5 && (
            <button className="w-full mt-4 text-primary hover:text-[#004f64] text-sm font-medium">
              View All Stocks →
            </button>
          )}
        </div>

        {/* My Holdings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">My Holdings</h3>
          <div className="space-y-4 h-full">
            {isHoldingsLoading ? (
              <div className="py-8 text-center text-gray-500">Loading holdings...</div>
            ) : isHoldingsError ? (
              <div className="py-8 text-center text-red-500">Failed to load holdings.</div>
            ) : !holdings || holdings.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <Image src="/images/no_data.svg" alt="No items" width={100} height={100} />
                <div className="py-2 text-center text-gray-500">No holdings found.</div>
              </div>
            ) : (
              holdings.map((item, index) => {
                // Try to get current price from marketData
                const market = marketData.find((m) => m.id === item.marketId);
                const currentPrice = market ? market.closing : item.averagePurchasePrice;
                const currentValue = item.sharesOwned * currentPrice;
                const investment = item.sharesOwned * item.averagePurchasePrice;
                const profit = currentValue - investment;
                const profitPercent = investment !== 0 ? (profit / investment) * 100 : 0;
                return (
                  <div key={item.id || index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium">{item.security}</p>
                      <p className="text-sm text-gray-500">{item.sharesOwned} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${currentValue.toFixed(2)}</p>
                      <p className={`text-sm ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}{profit.toFixed(2)} ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {holdings && holdings.length > 0 && (
            <button className="w-full mt-4 text-primary hover:text-[#004f64] text-sm font-medium">
              View Full Portfolio →
            </button>
          )}
        </div>

        {/* Market Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-center text-gray-600 mb-4">Market Overview</h3>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">S&P 500</span>
                <span className={`text-sm ${4.5 >= 0 ? 'text-green-600' : 'text-red-600'}`}>+4.5%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">NASDAQ</span>
                <span className={`text-sm ${3.2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>+3.2%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Dow Jones</span>
                <span className={`text-sm ${2.1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>+2.1%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '55%' }}></div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Bonds</span>
                <span className={`text-sm ${-1.8 >= 0 ? 'text-green-600' : 'text-red-600'}`}>-1.8%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 text-primary hover:text-[#004f64] text-sm font-medium">
            View Market Details →
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">Recent Transactions</h3>
        <div className="overflow-x-auto">
          {isTxLoading ? (
            <div className="py-8 text-center text-gray-500">Loading transactions...</div>
          ) : isTxError ? (
            <div className="py-8 text-center text-red-500">Failed to load transactions.</div>
          ) : recentTransactions.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No transactions found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.slice(0, 5).map((transaction, index) => (
                  <tr key={transaction.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${transaction.type === 'CREDIT' ? 'bg-green-100 text-green-800' :
                        transaction.type === 'DEBIT' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.symbol || '--'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.shares || '--'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      ${Number(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : '--'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${transaction.status === 'successful' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="w-full text-center">
          <Link href="/client/transactions" className="w-full pt-4 text-primary hover:text-[#004f64] text-center text-sm font-medium">
            View All Transactions →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default InvestmentDashboard;