"use client"
import { FiX, FiDollarSign, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number; // Added wallet balance prop
}

const WithdrawFundsModal = ({ isOpen, onClose, walletBalance }: WithdrawFundsModalProps) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Added for mobile money
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setAmount('');
    setSelectedMethod('');
    setPhoneNumber('');

    if (!modalRef.current || !overlayRef.current) return;

    animationRef.current = gsap.timeline({ defaults: { ease: 'power2.out' } });
    animationRef.current
      .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 0.5, duration: 0.3 })
      .fromTo(modalRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");

    return () => {
      animationRef.current?.kill();
      animationRef.current = null;
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedMethod || (selectedMethod === 'mobileMoney' && !phoneNumber)) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call with mobile money payload
      const payload = {
        amount,
        method: selectedMethod,
        ...(selectedMethod === 'mobileMoney' && { phoneNumber })
      };
      
      console.log("Withdrawal request:", payload); // Replace with actual API call
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Success! $${amount} withdrawn via ${selectedMethod === 'bank' ? 'Bank Transfer' : 'Mobile Money'}`);
      onClose();
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 bg-black opacity-0 z-40" onClick={onClose} />
      
      <div ref={modalRef} className="fixed inset-0 flex items-center justify-center z-50 opacity-0" style={{ pointerEvents: 'none' }}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 border border-gray-200" style={{ pointerEvents: 'auto' }}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
              <p className="text-sm text-gray-500 mt-1">Wallet Balance: ${Number(walletBalance).toFixed(2)}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Withdraw
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value <= walletBalance) setAmount(e.target.value);
                  }}
                  className={`block w-full pl-10 outline-none pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary ${ walletBalance < 100 ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max={walletBalance}
                  required
                />
              </div>
              {amount && parseFloat(amount) > walletBalance && (
                <p className="mt-1 text-sm text-red-500">Amount exceeds wallet balance</p>
              )}
            </div>
            
            {/* Withdrawal Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bank')}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-colors ${
                    selectedMethod === 'bank'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FiCreditCard className={`w-6 h-6 mb-2 ${
                    selectedMethod === 'bank' ? 'text-primary' : 'text-gray-500'
                  }`} />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </button>
                
                {/* Mobile Money */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('mobileMoney')}
                  className={`p-4 border rounded-lg flex flex-col items-center transition-colors ${
                    selectedMethod === 'mobileMoney'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FiSmartphone className={`w-6 h-6 mb-2 ${
                    selectedMethod === 'mobileMoney' ? 'text-primary' : 'text-gray-500'
                  }`} />
                  <span className="text-sm font-medium">Mobile Money</span>
                </button>
              </div>
            </div>

            {/* Mobile Money Phone Number Input (Conditional) */}
            {selectedMethod === 'mobileMoney' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Money Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSmartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-sm text-gray-500">
                    +250
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-20 outline-none pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="700000000"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Phone that will receive your funds</p>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!amount || !selectedMethod || isSubmitting || parseFloat(amount) > walletBalance || (selectedMethod === 'mobileMoney' && !phoneNumber)}
              className="w-full bg-primary hover:bg-[#004f64] text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Withdraw $${amount || '0.00'}`
              )}
            </button>
          </form>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-500 text-center">
              {selectedMethod === 'bank' 
                ? "Bank transfers take 1-3 business days" 
                : "Mobile money transfers are usually instant"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawFundsModal;