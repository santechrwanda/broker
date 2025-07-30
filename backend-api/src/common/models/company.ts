import { DataTypes } from "sequelize"
import sequelize from "../config/database"
import User from "./users"

const Company = sequelize.define("Company", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    comment: "Company name is required.",
  },
  security: {
    type: DataTypes.STRING,
    allowNull: true, // Can be false if always required for new companies
    unique: true, // Ensure security symbols are unique
    comment: "Security symbol of the company (e.g., MTNR)",
  },
  companyAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    comment: "Company address is required.",
  },
  companyTelephone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    comment: "Company telephone is required.",
  },
  companyLogo: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isCustomUrl(value: string) {
        if (value && !/^https?:\/\/(localhost|127\.0\.0\.1|\S+\.\S+)(:\d+)?(\/\S*)?$/.test(value)) {
          throw new Error("Company logo must be a valid URL including localhost or domain.")
        }
      },
    },
    comment: "The company logo should be a correct URL link.",
  },
  ownerFullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    comment: "Owner full name is required.",
  },
  ownerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    comment: "Owner email is required and must be valid.",
  },
  ownerAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    comment: "Owner address is required.",
  },
  ownerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    comment: "Owner phone is required.",
  },
  numberOfShares: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
    comment: "Number of shares must be at least 1.",
  },
  companyCategory: {
    type: DataTypes.ENUM(
      "technology",
      "finance",
      "healthcare",
      "manufacturing",
      "retail",
      "services",
      "energy",
      "real_estate",
      "agriculture",
      "transportation",
      "other",
    ),
    allowNull: false,
    comment: "Company category is required.",
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
    allowNull: false,
    comment: "Registration status.",
  },
  registeredBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    comment: "User who registered the company.",
  },
})

// Define associations
Company.belongsTo(User, {
  foreignKey: "registeredBy",
  as: "registrar",
})

User.hasMany(Company, {
  foreignKey: "registeredBy",
  as: "registeredCompanies",
})

export default Company
