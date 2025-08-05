export interface CommissionAttributes {
  id?: string
  brokerId: string
  customerId: string
  companyId: string
  numberOfShares: number
  pricePerShare: number
  totalAmount?: number
  commissionRate: number
  commissionAmount?: number
  status?: "pending" | "inprogress" | "completed" | "cancelled" | "rejected"
  notes?: string | null
  processedAt?: Date | null
  createdBy?: string | null
  createdAt?: Date
  updatedAt?: Date
  company?: any
}

export interface MarketAttributes {
  id?: string
  security: string
  closing: number
  previous: number
  change: number
  volume: number
  value: number
  scrapedAt?: Date
  latestScrapedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface UserShareAttributes {
  id?: string
  userId: string
  security: string
  sharesOwned: number
  averagePurchasePrice: number
  createdAt?: Date
  updatedAt?: Date
}

export interface TransactionAttributes {
  id?: string
  type: "buy" | "sell"
  userId: string
  brokerId: string
  companyId: string
  marketPriceAtTransaction?: number | null
  requestedShares: number
  agreedPricePerShare: number
  totalTransactionValue?: number
  status?:
    | "pending_broker_approval"
    | "pending_payment"
    | "payment_confirmed"
    | "shares_released"
    | "completed"
    | "cancelled"
    | "rejected"
    | "pending_market_listing"
    | "listed_on_market"
  paymentProofUrl?: string | null
  notes?: string | null
  completedAt?: Date | null
  createdBy?: string | null
  createdAt?: Date
  updatedAt?: Date
}

// New types for Wallet and WalletTransaction
export interface WalletAttributes {
  id?: string
  userId: string
  balance: number
  createdAt?: Date
  updatedAt?: Date
}

export interface WalletTransactionAttributes {
  id?: string
  userId: string
  walletId: string
  type: "CREDIT" | "DEBIT"
  amount: number
  status?: "pending" | "successful" | "failed" | "reversed"
  flutterwaveRef?: string | null // flw_ref from Flutterwave
  txRef: string // Your internal transaction reference
  paymentMethod?: string | null
  from?: string | null // Source of the transaction (e.g., payment method, user)
  to?: string | null // Destination of the transaction (e.g., payment method, user
  currency: string
  notes?: string | null
  completedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

// New type for Watchlist
export interface WatchlistAttributes {
  id?: string
  userId: string
  marketId: string
  addedAt?: Date
  createdAt?: Date
  updatedAt?: Date
  market?: MarketAttributes // Optional association to Market
}
