import React from 'react'
import { FaSpinner } from 'react-icons/fa'

interface LoadingProps {
  title?: string
}
const LoadingSpinner = ({ title = "Getting users..."}: LoadingProps) => {
  return (
    <div className="flex flex-col items-center">
        <FaSpinner size={50} className="animate-spin text-[#004f64]" />
        {title && <p className="text-gray-600 animate-pulse">{ title }</p>}
    </div>
  )
}

export default LoadingSpinner