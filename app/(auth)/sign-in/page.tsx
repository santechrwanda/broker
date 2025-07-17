import LoginForm from '@/components/forms/login-form';
import React from 'react';

const LoginPage = () => {
    return (
        <>
            <div className="absolute top-0 w-full h-full bg-gradient-to-br from-[#4daec9] via-[#004f64] to-[#004f64]"></div>         
            <LoginForm />
        </>
    );
};

export default LoginPage;