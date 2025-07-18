import NavigationLinks from '@/components/landing/nav-links';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const AuthenticationFooter = () => {
  return (
    <footer className="w-full relative mt-3 bg-white pb-3">
        <div className="container mx-auto px-4">
            <hr className="mb-3 border-b-1 border-gray-300" />
            <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full md:w-4/12 px-4">
                    <div className="text-sm text-gray-700 font-semibold py-1">
                        <Link href="/">
                            <Image 
                                src="/logo.svg"
                                alt="logo"
                                width={130}
                                height={40}
                                className="w-24"
                                priority
                            />
                        </Link>
                    </div>
                </div>
                <div className="w-full md:w-8/12 px-4 flex-wrap flex flex-1 justify-end">
                    <NavigationLinks />
                </div>
            </div>
        </div>
    </footer>
  )
}

export default AuthenticationFooter