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
  createdAt?: Date
}

export interface UserShareAttributes {
  id?: string
  userId: string
  companyId: string
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