"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setMessage("Your password has been reset. You can now sign in.");
    };

    return (
        <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-4/12 px-4 pt-20">
                    <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-white border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-[#004f64] text-lg font-bold">Reset Password</h6>
                                <p className="text-gray-500 text-sm mt-2">Enter your new password below.</p>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            {message && (
                                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="relative w-full mb-4">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 border border-gray-500/30 rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 border border-gray-500/30 rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="text-center mt-8">
                                    <button
                                        className="bg-[#004f64] text-white active:bg-[#003f50] text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                                        type="submit"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                                <div className="mt-3 flex gap-x-2 justify-center">
                                    <Link href="/sign-in" className="text-[#004f64] hover:underline">
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm; 