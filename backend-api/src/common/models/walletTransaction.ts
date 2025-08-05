import { DataTypes, type Model } from "sequelize"
import sequelize from "../config/database"
import User from "./users"
import Wallet from "./wallet"
import type { WalletTransactionAttributes } from "../utils/types"

export interface WalletTransactionInstance extends Model<WalletTransactionAttributes>, WalletTransactionAttributes {}

const WalletTransaction = sequelize.define<WalletTransactionInstance>("WalletTransaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    comment: "The user associated with this transaction",
  },
  walletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Wallet,
      key: "id",
    },
    comment: "The wallet associated with this transaction",
  },
  type: {
    type: DataTypes.ENUM("CREDIT", "DEBIT", "BUY", "SELL"),
    allowNull: false,
    comment: "Type of transaction: CREDIT (top-up) or DEBIT (withdrawal)",
  },
  amount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
    comment: "Amount of the transaction",
  },
  from: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "The source of the transaction (e.g., payment method, user)",
  },
  to: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "The destination of the transaction (e.g., payment method, user)",
  },
  status: {
    type: DataTypes.ENUM("pending", "successful", "failed", "reversed"),
    defaultValue: "pending",
    allowNull: false,
    comment: "Status of the transaction",
  },
  flutterwaveRef: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null for internal transactions or if Flutterwave ref isn't immediately available
    unique: true, // Ensure Flutterwave transaction IDs are unique
    comment: "Flutterwave transaction ID (flw_ref)",
  },
  txRef: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure internal transaction references are unique
    comment: "Internal unique transaction reference",
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Payment method used (e.g., card, mobile_money, bank_transfer)",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Additional notes about the transaction",
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Currency of the transaction (e.g., USD, EUR)",
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Timestamp when the transaction was completed/processed",
  },
})

// Define associations
WalletTransaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
})

WalletTransaction.belongsTo(Wallet, {
  foreignKey: "walletId",
  as: "wallet",
})

Wallet.hasMany(WalletTransaction, {
  foreignKey: "walletId",
  as: "transactions",
})

User.hasMany(WalletTransaction, {
  foreignKey: "userId",
  as: "walletTransactions",
})

export default WalletTransaction
