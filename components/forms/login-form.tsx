"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLoginUserMutation } from "@/hooks/use-authentication";
import { ReduxErrorProps } from "@/utility/types";
import { toast } from "react-toastify";

interface LoginFormProps {
    backendError?: string;
}

const LoginForm = ({ backendError }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const router = useRouter();

    const [loginUser, { isLoading, error }] = useLoginUserMutation();

    useEffect(()=> {
        if (backendError) {
            toast.error(backendError);
        }else if (error) {
            toast.error((error as ReduxErrorProps)?.data?.message || "An error occurred during login.");
        } 
    }, [backendError, error])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await loginUser({ email, password }).unwrap();
        router.refresh();
    };

    return (
        <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
                <div className="w-full lg:w-[37%] px-4 pt-3">
                    <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded-lg bg-white border-0">
                        <div className="rounded-t mb-0 px-6 py-6">
                            <div className="text-center mb-3">
                                <h6 className="text-gray-600 text-sm font-bold">
                                    Sign in with
                                </h6>
                            </div>
                            <div className="btn-wrapper text-center">
                                <Link
                                    href={`${process.env.NEXT_PUBLIC_API_URL}/api/google-login`}
                                    className="active:bg-gray-100 text-gray-600 font-normal cursor-pointer px-4 py-2 rounded-3xl outline-none focus:outline-none mb-1 shadow hover:bg-gray-100 inline-flex items-center border border-gray-500/30 text-base w-full justify-center"
                                    type="button"
                                >
                                    <span className="mr-2">
                                        <FcGoogle name="google" size={20} />
                                    </span>
                                    Continue with Google
                                </Link>
                            </div>
                            <hr className="mt-6 border-b-1 border-gray-300/40" />
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                            <div className="text-gray-500 text-center mb-3 font-bold">
                                <small>Or sign in with credentials</small>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 rounded text-sm shadow focus:outline-none border border-gray-500/30 focus:shadow-outline w-full"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="relative w-full mb-3">
                                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="px-3 py-3 placeholder-gray-400 text-gray-700 border border-gray-500/30 rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="flex flex-wrap mt-3">
                                    <label className="inline-flex w-1/2 items-center cursor-pointer">
                                        <input
                                            id="customCheckLogin"
                                            type="checkbox"
                                            className="form-checkbox text-gray-800 ml-1 w-5 h-5"
                                            checked={remember}
                                            onChange={(e) =>
                                                setRemember(e.target.checked)
                                            }
                                        />
                                        <span className="ml-2 text-sm font-semibold text-gray-700">
                                            Remember me
                                        </span>
                                    </label>
                                    <div className="w-1/2 text-right">
                                        <Link
                                            href="/forgot-password"
                                            className="text-[#004f64] hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="text-center mt-6">
                                    <button
                                        className="bg-[#004f64] text-white active:bg-[#003f50] text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full flex items-center justify-center"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <FaSpinner className="animate-spin mr-2" />
                                        ) : null}
                                        SIGN IN
                                    </button>
                                </div>

                                <div className="mt-3 flex gap-x-2">
                                    Don&apos;t have an account?
                                    <Link
                                        href="/sign-up"
                                        className="text-[#004f64] hover:underline"
                                    >
                                        Create new account
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

export default LoginForm;
