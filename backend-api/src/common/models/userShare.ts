import { DataTypes, type Model } from "sequelize"
import sequelize from "../config/database"
import User from "./users"
import type { UserShareAttributes } from "../utils/types"

export interface UserShareInstance extends Model<UserShareAttributes>, UserShareAttributes {}

const UserShare = sequelize.define<UserShareInstance>("UserShare", {
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
    unique: "userSecurityUnique", // Ensure a user has only one entry per security
    comment: "The user who owns these shares",
  },
  security: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "userSecurityUnique", // Ensure a user has only one entry per security
    comment: "The security symbol of the shares owned",
  },
  sharesOwned: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
    comment: "Number of shares owned by the user in this security",
  },
  averagePurchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      min: 0,
    },
    comment: "Average price at which the shares were purchased",
  },
})

// Define associations
UserShare.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
})

// UserShare does not directly belong to Market in a foreign key sense
// as Market entries are time-series. We will join by 'security' in queries.

User.hasMany(UserShare, {
  foreignKey: "userId",
  as: "ownedShares",
})

export default UserShare
