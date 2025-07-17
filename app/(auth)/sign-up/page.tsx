import SignupForm from '@/components/forms/signup-form';
import React from 'react';

const SignupPage = () => {
    return (
        <>
            <div className="absolute top-0 w-full h-full bg-gradient-to-br from-[#4daec9] via-[#004f64] to-[#004f64]"></div>
            <SignupForm />
        </>
    );
};

export default SignupPage;