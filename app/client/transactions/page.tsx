"use client";
import React, { useState } from 'react';
import { useGetMyTransactionsQuery } from '@/hooks/use-transaction';
import {
    IoSettingsSharp,
    IoSearchOutline,
    IoFilterSharp,
    IoChevronDown,
    IoChevronUp,
    IoSendOutline,
    IoArrowDownOutline,
    IoCloseOutline,
    IoCheckmarkOutline,
} from 'react-icons/io5';
import {
    MdAccountBalanceWallet,
    MdSwapHoriz,
} from 'react-icons/md';
import { CURRENTCY } from '@/utility/constants';
import GeneralPagination from '@/components/common/pagination';

const CryptoTransactionsPage = () => {
    const [sortBy, setSortBy] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');

    // Summary cards data
    const summaryCards = [
        {
            icon: MdAccountBalanceWallet,
            title: `Balance (${CURRENTCY})`,
            amount: 200,
            suffix: '.68K',
            iconColor: '#10B981',
            bgColor: 'bg-emerald-50'
        },
        {
            icon: IoSendOutline,
            title: 'Send (Previous Month)',
            amount: 1,
            suffix: '.34K',
            iconColor: '#3B82F6',
            bgColor: 'bg-blue-50'
        },
        {
            icon: IoArrowDownOutline,
            title: 'Receive (Previous Month)',
            amount: 25,
            suffix: '.22K',
            iconColor: '#10B981',
            bgColor: 'bg-emerald-50'
        },
        {
            icon: MdSwapHoriz,
            title: 'Send - Receive (Previous Month)',
            amount: 124,
            suffix: '.36K',
            iconColor: '#F59E0B',
            bgColor: 'bg-amber-50',
            cryptoName: 'Monero (XMR)'
        }
    ];

    // Fetch wallet transactions from API
    const { data: transactions = [], isLoading, isError } = useGetMyTransactionsQuery({});
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);

    const formatCurrency = (amount: number, currency = 'USD') => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        }
        return `${amount.toFixed(2)} ${currency}`;
    };

    const formatCompactAmount = (amount: number, suffix: string) => {
        return `Rwf ${amount.toLocaleString()}${suffix}`;
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ?
            <IoChevronUp className="w-4 h-4 ml-1" /> :
            <IoChevronDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="min-h-screen">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {summaryCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-md flex justify-between items-center w-full shadow-sm p-6 border border-gray-200">
                        <div className="mb-5">
                            <p className="text-xl font-bold text-title">
                                {formatCompactAmount(card.amount, card.suffix)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
                        </div>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                <card.icon className="w-6 h-6" style={{ color: card.iconColor }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All</option>
                            <option value="Deposit">Deposit</option>
                            <option value="Withdraw">Withdraw</option>
                            <option value="Transfer">Transfer</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-primary hover:bg-title cursor-pointer text-white px-6 py-2 rounded-md transition-colors">
                        Deposit
                    </button>
                    <button className="hover:bg-red-600 border text-red-600 border-red-600 hover:text-white cursor-pointer px-6 py-2 rounded-md transition-colors">
                        Withdraw
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">All Transactions</h2>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <IoSearchOutline className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
                                <IoFilterSharp className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                                    <button
                                        onClick={() => handleSort('timestamp')}
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Timestamp
                                        {getSortIcon('timestamp')}
                                    </button>
                                </th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                                    <button
                                        onClick={() => handleSort('currency')}
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Currency
                                        {getSortIcon('currency')}
                                    </button>
                                </th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">From</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">To</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Notes</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                                    <button
                                        onClick={() => handleSort('type')}
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Type
                                        {getSortIcon('type')}
                                    </button>
                                </th>
                                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">
                                    <button
                                        onClick={() => handleSort('amount')}
                                        className="flex items-center hover:text-gray-700"
                                    >
                                        Amount
                                        {getSortIcon('amount')}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={8} className="py-8 text-center text-gray-500">Loading transactions...</td></tr>
                            ) : isError ? (
                                <tr><td colSpan={8} className="py-8 text-center text-red-500">Failed to load transactions.</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={8} className="py-8 text-center text-gray-500">No transactions found.</td></tr>
                            ) : (
                                filteredTransactions.map((transaction, index) => (
                                    <tr key={transaction.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${transaction.status === 'successful' ? 'bg-emerald-50' : transaction.status === 'failed' ? 'bg-red-50' : 'bg-gray-100'}`}>
                                                    {transaction.status === 'successful' ? <IoCheckmarkOutline className="w-3 h-3 text-emerald-500" /> : transaction.status === 'failed' ? <IoCloseOutline className="w-3 h-3 text-red-500" /> : <IoSettingsSharp className="w-3 h-3 text-gray-400" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : '--'}</p>
                                                    <p className="text-sm text-gray-500">{transaction.createdAt ? new Date(transaction.createdAt).toLocaleTimeString() : '--'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    {/* Optionally show currency initials */}
                                                    <span className="font-bold text-gray-700">{transaction.currency || '--'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{transaction.from || '--'}</td>
                                        <td className="py-4 px-6 text-gray-600">{transaction.to || '--'}</td>
                                        <td className="py-4 px-6 text-gray-600">{transaction.notes || '--'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${transaction.type === 'CREDIT'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : transaction.type === 'DEBIT'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(Number(transaction.amount), transaction.currency)}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <GeneralPagination 
                    datas={ transactions }
                    setPaginatedData={ setFilteredTransactions }
                />
            </div>
        </div>
    );
};

export default CryptoTransactionsPage;