import LoginForm from "@/components/forms/login-form";
import Link from "next/link";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

interface LoginProps {
    searchParams: Promise<{ error: string }>
}
const LoginPage = async({ searchParams }: LoginProps) => {

    const { error } = await searchParams;

    return (
        <div>
            <div className="absolute top-0 w-full h-full bg-gradient-to-br from-[#4daec9] via-[#004f64] to-[#004f64]"></div>
            <Link
                href="/"
                className="fixed top-4 left-4 text-gray-700 hover:text-[#004f64] z-50"
            >
                <FaArrowLeftLong size={28} className="text-white" />
            </Link>
            <LoginForm backendError={ error || "" } />
        </div>
    );
};

export default LoginPage;
