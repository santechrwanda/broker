import { DataTypes, type Model } from "sequelize"
import sequelize from "../config/database"
import User from "./users"
import Company from "./company"
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
    unique: "userCompanyUnique", // Ensure a user has only one entry per company
    comment: "The user who owns these shares",
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Company,
      key: "id",
    },
    unique: "userCompanyUnique", // Ensure a user has only one entry per company
    comment: "The company whose shares are owned",
  },
  sharesOwned: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
    comment: "Number of shares owned by the user in this company",
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

UserShare.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
})

User.hasMany(UserShare, {
  foreignKey: "userId",
  as: "ownedShares",
})

Company.hasMany(UserShare, {
  foreignKey: "companyId",
  as: "shareholders",
})

export default UserShare