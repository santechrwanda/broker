"use client";
import { useState, useEffect, useRef } from 'react';
import { FiX, FiCreditCard, FiDollarSign, FiArrowRight, FiPhone } from 'react-icons/fi';
import { AiFillBank } from 'react-icons/ai';
import { gsap } from 'gsap';
import { useFundWalletMutation } from '@/hooks/use-wallet';
import { toast } from 'react-toastify';
import { MdCurrencyFranc } from 'react-icons/md';

const DepositFundsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'card' | 'bank' | 'momo'>('card');
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [fundWallet, { isLoading: isProcessing, data: fundData, isError, error: fundError, reset }] = useFundWalletMutation();

  // Sample payment methods
  const cards = [
    { id: 'card1', last4: '4242', brand: 'Visa', expires: '12/25' },
    { id: 'card2', last4: '5555', brand: 'Mastercard', expires: '06/24' },
  ];

  // Mobile Money providers
  const momoProviders = [
    { id: 'mtn', name: 'MTN Mobile Money', icon: '🟢' },
    { id: 'airtel', name: 'Airtel Money', icon: '🔵' }
  ];

  // Animation setup
  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setAmount('');
      setSelectedCard(null);
      setPhoneNumber('');
      setIsSuccess(false);
      
      // Animation when modal opens
      gsap.set([modalRef.current, overlayRef.current], { opacity: 0 });
      gsap.to(overlayRef.current, { opacity: 0.5, duration: 0.3 });
      gsap.to(modalRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    // Animation when modal closes
    gsap.to([modalRef.current, overlayRef.current], { 
      opacity: 0, 
      duration: 0.2,
      onComplete: () => {
        // Reset position after animation completes
        if (modalRef.current) {
          gsap.set(modalRef.current, { y: 20 });
        }
        onClose();
      }
    });
  };

  useEffect(() => {
    if(isError && fundError){
      toast.error((fundError as any)?.data?.message || 'Failed to fund wallet');
      reset();
    }
  }, [isError, fundError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payload based on activeTab
    let payload: any = {
      amount: Number(amount),
      currency: 'RWF'
    };

    if (activeTab === 'card') {
      payload.paymentMethod = 'card';
      payload.phoneNumber = '';
      payload.momo_network = '';
    } else if (activeTab === 'bank') {
      payload.paymentMethod = 'bank_transfer';
      payload.phoneNumber = '';
      payload.momo_network = '';
    } else if (activeTab === 'momo') {
      payload.paymentMethod = 'mobile_money';
      payload.phoneNumber = `250${phoneNumber}`;
      payload.momo_network = selectedCard?.toUpperCase() || '';
    }

    await fundWallet(payload).unwrap();
    setIsSuccess(true);

  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black opacity-0 z-40"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 flex items-center justify-center z-50 opacity-0"
        style={{ transform: 'translateY(20px)' }}
      >
        <div className="bg-white rounded-xl shadow-sm w-full max-w-lg mx-4 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Deposit Funds</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Success State */}
          {isSuccess ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Deposit Successful!</h3>
              <p className="text-gray-500">{fundData?.payment_instructions?.note}</p>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Tabs */}
                <div className="flex mb-6 border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('card')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'card' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FiCreditCard className="w-5 h-5" />
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bank')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'bank' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <AiFillBank className="w-5 h-5" />
                    Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('momo')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === 'momo' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FiPhone className="w-5 h-5" />
                    Mobile
                  </button>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdCurrencyFranc className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-primary focus:border-primary"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">RWF</span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Method Content */}
                {activeTab === 'card' && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Method</h3>
                    <div className="space-y-3">
                      {cards.map((card) => (
                        <div
                          key={card.id}
                          onClick={() => setSelectedCard(card.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedCard === card.id
                              ? 'border-primary bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <FiCreditCard className="text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{card.brand} •••• {card.last4}</p>
                                <p className="text-xs text-gray-500">Expires {card.expires}</p>
                              </div>
                            </div>
                            {selectedCard === card.id && (
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="w-full py-3 px-4 border border-dashed border-gray-300 rounded-lg text-primary hover:text-title hover:border-blue-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiCreditCard className="w-5 h-5" />
                        Add New Card
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'bank' && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Bank Transfer</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <AiFillBank className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-700 mb-2">Connect your bank account</p>
                      <p className="text-sm text-gray-500 mb-4">Securely link your bank for instant transfers</p>
                      <button
                        type="button"
                        className="w-full py-2 px-4 bg-primary hover:bg-title text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        Connect Bank
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'momo' && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Mobile Money Provider</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {momoProviders.map((provider) => (
                          <button
                            key={provider.id}
                            type="button"
                            onClick={() => setSelectedCard(provider.id)}
                            className={`p-3 border rounded-lg transition-all flex flex-col items-center ${
                              selectedCard === provider.id
                                ? 'border-primary bg-blue-50'
                                : 'border-gray-300 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{provider.icon}</div>
                            <span className="text-xs font-medium text-center">{provider.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">+250</span>
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                          className="block w-full pl-14 py-3 border border-gray-300 rounded-lg outline-none focus:ring-primary focus:border-primary"
                          placeholder="78XXXXXXX"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">You'll receive a confirmation prompt</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!amount || isProcessing || (activeTab === 'momo' && !phoneNumber)}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                    !amount || isProcessing || (activeTab === 'momo' && !phoneNumber)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary hover:bg-title'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Deposit {amount ? `RWF ${amount}` : 'Funds'}
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg border-gray-200">
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-xs text-gray-500">Payments are secure and encrypted</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DepositFundsModal;