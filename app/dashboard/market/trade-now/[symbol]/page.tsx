"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa"
import LoadingSpinner from "@/components/common/loading-spinner"
import Breadcrumb from "@/components/ui/breadcrum"
import { useGetMarketBySecurityQuery } from "@/hooks/use-market"
import { CURRENTCY } from "@/utility/constants"

// Mock user ID for demonstration purposes
const MOCK_USER_ID = "user-123"

const MOCK_COMPANIES = [
  {
    id: "comp-1",
    companyName: "Bralirwa Plc",
    companySymbol: "BRALIRWA",
    companyAddress: "Kigali, Rwanda",
    companyCategory: "Beverages",
    website: "https://www.bralirwa.com",
  },
  {
    id: "comp-2",
    companyName: "MTN Rwanda",
    companySymbol: "MTNRWANDA",
    companyAddress: "Kigali, Rwanda",
    companyCategory: "Telecommunications",
    website: "https://www.mtn.co.rw",
  },
  {
    id: "comp-3",
    companyName: "Kenya Commercial Bank",
    companySymbol: "KCB",
    companyAddress: "Nairobi, Kenya",
    companyCategory: "Banking",
    website: "https://ke.kcbbankgroup.com",
  },
]

// Mock BuyRequest type for static data
type BuyRequest = {
  id: string
  securityId: string
  shares: number
  userId: string
  status: "pending" | "approved" | "rejected" | "completed"
}

export default function TradePage() {
  const params = useParams()
  const symbol = decodeURIComponent(params.symbol as string);

  // Fetch security info from API
  const { data: marketData, isLoading: isMarketLoading, error: marketError } = useGetMarketBySecurityQuery(
    { security: symbol, limit: 1 },
    { skip: !symbol }
  );

  // Use the first result as the security info
  const security = marketData && marketData.length > 0 ? marketData[0] : undefined;
  const company = MOCK_COMPANIES.find((c) => c.id === security?.companyId)

  console.log("Security Data:", security);

  const [shares, setShares] = useState(0)
  const [currentStep, setCurrentStep] = useState<
    "request" | "pending" | "approved" | "rejected" | "payment" | "completed"
  >("request")
  const [buyRequestId, setBuyRequestId] = useState<string | null>(null)

  // Simulate loading states
  const [isRequesting, setIsRequesting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  // No useEffect for data fetching errors as data is static

  const handleRequestBuy = async () => {
    if (!security || shares <= 0) {
      toast.error("Please enter a valid number of shares.")
      return
    }

    // 💡 Check if volume is zero
    if (security.volume === 0) {
      toast.info("You can't buy shares. No available trading volume.")
      return
    }

    if (shares > security.availableShares) {
      toast.error("Not enough shares available.")
      return
    }

    setIsRequesting(true)
    // Simulate API call
    setTimeout(() => {
      const newBuyRequest: BuyRequest = {
        id: `req-${Date.now()}`,
        securityId: security.id,
        shares,
        userId: MOCK_USER_ID,
        status: "pending",
      }
      setBuyRequestId(newBuyRequest.id)
      setCurrentStep("pending")
      toast.success("Share purchase request submitted successfully!")
      setIsRequesting(false)
    }, 1500)
  }

  // Simulate approval (e.g., by an admin)
  const simulateApproval = async (approved: boolean) => {
    if (!buyRequestId) return

    setIsApproving(true)
    // Simulate API call
    setTimeout(() => {
      if (approved) {
        setCurrentStep("approved")
        toast.success("Your request has been approved!")
      } else {
        setCurrentStep("rejected")
        toast.info("Your request has been rejected.")
      }
      setIsApproving(false)
    }, 1500)
  }

  const handleProceedToPayment = () => {
    setCurrentStep("payment")
  }

  const handlePayment = async () => {
    if (!buyRequestId) return

    setIsPaying(true)
    // Simulate API call
    setTimeout(() => {
      setCurrentStep("completed")
      toast.success("Payment successful! Shares acquired.")
      setIsPaying(false)
    }, 1500)
  }

  const renderStepContent = () => {
    // No loading spinners for initial data as it's static
    if (!security) {
      return <div className="text-center py-8 text-red-500">Security "{symbol}" not found.</div>
    }
    const totalCost = shares * security?.closing

    switch (currentStep) {
      case "request":
        if (security.volume === 0) {
          return (
            <div className="text-center py-10">
              <FaInfoCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Trading Volume</h2>
              <p className="text-gray-600 mb-4">
                This security is currently not available for trading. No shares are being traded at the moment.
              </p>
              <p className="text-gray-600 mb-6">
                Please select a different security with available trading volume to proceed with your purchase.
              </p>
              <a
                href="/dashboard/market"
                className="inline-block px-6 py-3 bg-[#2288a4] text-white rounded hover:bg-[#004f64] transition"
              >
                Browse Other Securities
              </a>
            </div>
          )
        }

        return (
          <>
            <h2 className="text-xl text-gray-700 font-semibold mb-4">Request Shares</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="shares" className="block text-sm font-medium text-gray-700">
                  Number of Shares
                </label>
                <input
                  id="shares"
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(Number.parseInt(e.target.value) || 0)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter shares to buy"
                  min="0"
                  max={security.availableShares}
                  disabled={isRequesting}
                />
                {shares > security.availableShares && (
                  <p className="mt-1 text-sm text-red-500">
                    You can only request up to {security.availableShares} shares.
                  </p>
                )}
              </div>
              <p className="text-lg font-medium text-gray-800">Estimated Total: {CURRENTCY} {totalCost?.toLocaleString?.() ?? "0"}</p>
              <button
                onClick={handleRequestBuy}
                disabled={isRequesting || shares <= 0 || shares > security.availableShares}
                className="w-full px-4 py-2 cursor-pointer bg-[#20acd3] text-white rounded hover:bg-[#5693a4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isRequesting ? (
                  <>
                    <LoadingSpinner /> Requesting...
                  </>
                ) : (
                  "Request to Buy"
                )}
              </button>
            </div>
          </>
        )
      case "pending":
        return (
          <div className="text-center py-10">
            <FaInfoCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Request Pending Approval</h2>
            <p className="text-gray-600">
              Your request for {shares} shares of {symbol} is awaiting approval. You will be notified once it's
              reviewed.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              {/* Simulate admin actions for demo */}
              <button
                onClick={() => simulateApproval(true)}
                disabled={isApproving}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Simulate Approve
              </button>
              <button
                onClick={() => simulateApproval(false)}
                disabled={isApproving}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                Simulate Reject
              </button>
            </div>
          </div>
        )
      case "approved":
        return (
          <div className="text-center py-10">
            <FaCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Request Approved!</h2>
            <p className="text-gray-600 mb-6">
              Your request for {shares} shares of {symbol} has been approved. Proceed to payment to complete your
              purchase.
            </p>
            <button
              onClick={handleProceedToPayment}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Proceed to Payment
            </button>
          </div>
        )
      case "rejected":
        return (
          <div className="text-center py-10">
            <FaTimesCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Request Rejected</h2>
            <p className="text-gray-600">
              Unfortunately, your request for {shares} shares of {symbol} was rejected. Please contact support for more
              details or try again.
            </p>
            <button
              onClick={() => setCurrentStep("request")}
              className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Make New Request
            </button>
          </div>
        )
      case "payment":
        return (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Complete Payment</h2>
            <p className="text-gray-600 mb-6">
              Total amount due: <span className="font-bold text-gray-900">${totalCost.toLocaleString()}</span> for{" "}
              {shares} shares of {symbol}.
            </p>
            <button
              onClick={handlePayment}
              disabled={isPaying}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isPaying ? (
                <>
                  <LoadingSpinner /> Processing Payment...
                </>
              ) : (
                "Simulate Payment"
              )}
            </button>
            <p className="mt-4 text-sm text-gray-500">
              (This is a simulation. In a real app, you'd integrate a payment gateway.)
            </p>
          </div>
        )
      case "completed":
        return (
          <div className="text-center py-10">
            <FaCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Purchase Completed!</h2>
            <p className="text-gray-600">
              Congratulations! You have successfully acquired {shares} shares of{" "}
              <span className="font-semibold">{symbol}</span>.
            </p>
            <button
              onClick={() => {
                setCurrentStep("request")
                setShares(0)
                setBuyRequestId(null)
              }}
              className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Make Another Purchase
            </button>
          </div>
        )
      default:
        return null
    }
  }

  console.log("Security:", security)

  return (
    <div className="p-5 pt-0">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Market", href: "/dashboard/market" },
          { label: "Trade Now" },
        ]}
      />
      <h1 className="text-2xl text-[#004f64] font-bold mb-4">Trade {symbol}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Company & Security Info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-xl text-gray-700 font-semibold mb-2">Company/Organization Info</h2>
            {company ? (
              <>
                <p>
                  <strong className="text-gray-500">Name:</strong> {company.companyName}
                </p>
                <p>
                  <strong className="text-gray-500">Address:</strong> {company.companyAddress}
                </p>
                <p>
                  <strong className="text-gray-500">Sector:</strong> {company.companyCategory}
                </p>
                <p>
                  <strong className="text-gray-500">Website:</strong>{" "}
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </p>
              </>
            ) : (
              <p className="text-gray-500">Company details not available.</p>
            )}
          </div>

          <div className="bg-white p-5 rounded shadow">
            <h2 className="text-xl text-gray-700 font-semibold mb-2">Security Info</h2>
            {isMarketLoading ? (
              <p className="text-gray-500">Loading security data...</p>
            ) : marketError ? (
              <p className="text-red-500">Failed to load security data.</p>
            ) : security ? (
              <>
                <p>
                  <strong className="text-gray-500">Symbol:</strong> {symbol}
                </p>
                <p>
                  <strong className="text-gray-500">Price per Share:</strong> ${security.closing?.toLocaleString?.() ?? "0"}
                </p>
                <p>
                  <strong className="text-gray-500">Available Shares:</strong> {security.availableShares?.toLocaleString?.() ?? "0"}
                </p>
                <p>
                  <strong className="text-gray-500">Closing Price:</strong> ${security.closing?.toLocaleString?.() ?? "0"}
                </p>
                <p>
                  <strong className="text-gray-500">Previous Close:</strong> ${security.previous?.toLocaleString?.() ?? "0"}
                </p>
                <p>
                  <strong className="text-gray-500">Change:</strong>{" "}
                  <span
                    className={`font-semibold ${security.change < 0
                      ? "text-red-500"
                      : security.change === 0
                        ? "text-gray-500"
                        : "text-green-500"
                      }`}
                  >
                    {security.change?.toFixed?.(2) ?? "0"}%
                  </span>
                </p>
                <p>
                  <strong className="text-gray-500">Volume:</strong> {security.volume?.toLocaleString?.() ?? "0"}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Security details not available.</p>
            )}
          </div>
        </div>

        {/* Right Column: Buy Shares Flow */}
        <div className="bg-white p-5 rounded shadow flex flex-col h-full">{renderStepContent()}</div>
      </div>
    </div>
  )
}