import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import User from "./users"
import Company from "./company"
import { CommissionAttributes } from "../utils/types"

export interface CommissionInstance extends Model<CommissionAttributes>, CommissionAttributes {}

const Commission = sequelize.define<CommissionInstance>("Commission", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  brokerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    comment: "Broker handling the commission (teller or agent)",
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    comment: "Customer requesting to buy shares (client)",
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Company,
      key: "id",
    },
    comment: "Company whose shares are being purchased",
  },
  numberOfShares: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
    comment: "Number of shares customer wants to buy",
  },
  pricePerShare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01,
    },
    comment: "Price per share in currency",
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: "Total transaction amount (numberOfShares * pricePerShare)",
  },
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 100,
    },
    comment: "Commission rate percentage for the broker",
  },
  commissionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
    comment: "Commission amount earned by broker",
  },
  status: {
    type: DataTypes.ENUM("pending", "inprogress", "completed", "cancelled", "rejected"),
    defaultValue: "pending",
    allowNull: false,
    comment: "Commission status",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Additional notes about the commission",
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "When the commission was processed/completed",
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    comment: "User who created this commission record",
  },
})

// Define associations
Commission.belongsTo(User, {
  foreignKey: "brokerId",
  as: "broker",
})

Commission.belongsTo(User, {
  foreignKey: "customerId",
  as: "customer",
})

Commission.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
})

Commission.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
})

// Reverse associations
User.hasMany(Commission, {
  foreignKey: "brokerId",
  as: "brokerCommissions",
})

User.hasMany(Commission, {
  foreignKey: "customerId",
  as: "customerCommissions",
})

Company.hasMany(Commission, {
  foreignKey: "companyId",
  as: "commissions",
})

export default Commission
