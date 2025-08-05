"use client";
import { useState, useRef } from "react";
import { 
  FiArrowRight, 
  FiArrowLeft, 
  FiCheck, 
  FiCreditCard, 
  FiShield,
  FiDollarSign,
  FiX
} from "react-icons/fi";
import { gsap } from "gsap";
import { toast } from "react-toastify";

const MultiStepTradeForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shares, setShares] = useState<number | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Animation for step transitions
  const animateStepChange = (direction: "forward" | "backward") => {
    const formElement = formRef.current;
    if (!formElement) return;

    const duration = 0.3;
    const fromX = direction === "forward" ? 100 : -100;

    gsap.set(formElement, { x: fromX, opacity: 0 });
    gsap.to(formElement, {
      x: 0,
      opacity: 1,
      duration,
      ease: "power2.out"
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && (!shares || shares <= 0)) {
      toast.error("Please enter a valid number of shares");
      return;
    }

    animateStepChange("forward");
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    animateStepChange("backward");
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleConfirmPurchase = () => {
    setIsProcessing(true);
    // Simulate wallet deduction
    setTimeout(() => {
      setIsProcessing(false);
      handleNext(); // Move to success step
    }, 1000);
  };

  // Progress steps configuration
  const steps = [
    { id: 1, name: "Order", icon: <FiDollarSign /> },
    { id: 2, name: "Confirm", icon: <FiCheck /> },
    { id: 3, name: "Complete", icon: <FiCheck /> }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Progress Stepper */}
      <div className="w-full bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center relative">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  currentStep >= step.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-xs mt-2 ${
                  currentStep >= step.id ? "text-primary font-medium" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 mx-10 z-0">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-hidden relative p-4">
        <div
          ref={formRef}
          className="absolute inset-0 p-4 transition-all duration-300"
        >
          {currentStep === 1 && (
            <OrderStep shares={shares} setShares={setShares} />
          )}

          {currentStep === 2 && (
            <ConfirmStep 
              shares={shares} 
              onConfirm={handleConfirmPurchase} 
              isProcessing={isProcessing} 
            />
          )}

          {currentStep === 3 && <SuccessStep shares={shares} />}
        </div>
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 3 && (
        <div className="flex justify-between p-4 bg-white border-t">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isProcessing}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              currentStep === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-primary hover:bg-blue-50"
            }`}
          >
            <FiArrowLeft />
            Back
          </button>
          
          <button
            onClick={currentStep === 2 ? handleConfirmPurchase : handleNext}
            disabled={isProcessing || (currentStep === 1 && (!shares || shares <= 0))}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              isProcessing
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary hover:bg-blue-600 text-white"
            }`}
          >
            {currentStep === 2 ? "Confirm Purchase" : "Continue"}
            <FiArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

// Step 1: Order Details
const OrderStep = ({ shares, setShares }: any) => {
  return (
    <div className="space-y-6 h-full">
      <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Security:</span>
            <span className="font-medium">BRALIRWA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Price:</span>
            <span className="font-medium">RWF 1,200</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Number of Shares
        </label>
        <input
          type="number"
          value={shares || ""}
          onChange={(e) => setShares(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          placeholder="Enter shares to buy"
          min="1"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between font-medium">
          <span>Estimated Total:</span>
          <span>RWF {(shares || 0) * 1200}</span>
        </div>
      </div>
    </div>
  );
};

// Step 2: Confirmation
const ConfirmStep = ({ shares, onConfirm, isProcessing }: any) => {
  const totalAmount = (shares || 0) * 1200;

  return (
    <div className="space-y-6 h-full">
      <h2 className="text-2xl font-bold text-gray-800">Confirm Purchase</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium">Wallet Balance</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shares:</span>
          <span className="font-medium">{shares}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Price per Share:</span>
          <span className="font-medium">RWF 1,200</span>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between font-medium">
            <span>Total Amount:</span>
            <span className="text-primary">RWF {totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-1">Wallet Balance</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Balance:</span>
          <span className="font-medium">RWF 15,000</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-600">After Purchase:</span>
          <span className="font-medium">RWF {15000 - totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

// Step 3: Success
const SuccessStep = ({ shares }: any) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <FiCheck className="text-green-500 text-3xl" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Completed!</h2>
      <p className="text-gray-600 mb-6">
        {shares} shares of BRALIRWA have been added to your portfolio
      </p>
      
      <div className="bg-white p-4 rounded-lg shadow-sm w-full max-w-md">
        <h3 className="font-medium mb-3">Transaction Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span>TRX-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Deducted:</span>
            <span className="font-medium">RWF {(shares || 0) * 1200}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepTradeForm;