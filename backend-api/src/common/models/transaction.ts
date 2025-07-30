import { DataTypes, type Model } from "sequelize"
import sequelize from "../config/database"
import User from "./users"
import Company from "./company"
import type { TransactionAttributes } from "../utils/types"

export interface TransactionInstance extends Model<TransactionAttributes>, TransactionAttributes {}

const Transaction = sequelize.define<TransactionInstance>("Transaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("buy", "sell"),
    allowNull: false,
    comment: "Type of transaction: buy or sell",
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    comment: "The customer initiating the transaction",
  },
  brokerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    comment: "The broker handling the transaction",
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Company,
      key: "id",
    },
    comment: "The company whose shares are involved",
  },
  marketPriceAtTransaction: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // Can be null if market data isn't available or for manual transactions
    comment: "Market price of the share at the time of transaction initiation",
  },
  requestedShares: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
    comment: "Number of shares requested by the user",
  },
  agreedPricePerShare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
    comment: "The price per share agreed upon for the transaction",
  },
  totalTransactionValue: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: "Total value of the transaction (requestedShares * agreedPricePerShare)",
  },
  status: {
    type: DataTypes.ENUM(
      "pending_broker_approval",
      "pending_payment",
      "payment_confirmed",
      "shares_released",
      "completed",
      "cancelled",
      "rejected",
      "pending_market_listing",
      "listed_on_market",
    ),
    defaultValue: "pending_broker_approval",
    allowNull: false,
    comment: "Current status of the transaction workflow",
  },
  paymentProofUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isCustomUrl(value: string) {
        if (value && !/^https?:\/\/(localhost|127\.0\.0\.1|\S+\.\S+)(:\d+)?(\/\S*)?$/.test(value)) {
          throw new Error("Payment proof must be a valid URL including localhost or domain.")
        }
      },
    },
    comment: "URL to the payment proof screenshot (for buy transactions)",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Additional notes or reasons for status changes",
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Timestamp when the transaction was completed",
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    comment: "User who created this transaction record",
  },
})

// Define associations
Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "customer",
})

Transaction.belongsTo(User, {
  foreignKey: "brokerId",
  as: "broker",
})

Transaction.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
})

Transaction.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
})

// Reverse associations
User.hasMany(Transaction, {
  foreignKey: "userId",
  as: "customerTransactions",
})

User.hasMany(Transaction, {
  foreignKey: "brokerId",
  as: "brokerTransactions",
})

Company.hasMany(Transaction, {
  foreignKey: "companyId",
  as: "companyTransactions",
})

export default Transaction