import Image from 'next/image'
import React from 'react'
import { FaSpinner } from 'react-icons/fa'

const LoadingSpinner = () => {
  return (
    <div className="relative flex flex-col items-center">
        <FaSpinner size={50} className="animate-spin text-[#004f64]" />
        <Image
            src="/icon.svg" 
            alt="website log"
            width={ 20 }
            height={ 20 }
            className="object-cover w-5 h-auto absolute top-4 left-11"
        />
        <p className="text-gray-600 animate-pulse">Getting users...</p>
    </div>
  )
}

export default LoadingSpinner