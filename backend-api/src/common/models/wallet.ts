import { DataTypes, type Model } from "sequelize"
import sequelize from "../config/database"
import User from "./users"
import type { WalletAttributes } from "../utils/types"

export interface WalletInstance extends Model<WalletAttributes>, WalletAttributes {}

const Wallet = sequelize.define<WalletInstance>("Wallet", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // Each user has only one wallet
    references: {
      model: User,
      key: "id",
    },
    comment: "The user who owns this wallet",
  },
  balance: {
    type: DataTypes.DECIMAL(18, 2), // Up to 18 digits total, 2 after decimal
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      min: 0,
    },
    comment: "Current balance of the wallet",
  },
})

// Define associations
Wallet.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
})

User.hasOne(Wallet, {
  foreignKey: "userId",
  as: "wallet",
  onDelete: "CASCADE", // If user is deleted, delete their wallet
})

export default Wallet