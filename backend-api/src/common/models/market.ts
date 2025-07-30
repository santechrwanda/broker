import { DataTypes, type Model } from "sequelize"
import sequelize from "../config/database"
import type { MarketAttributes } from "../utils/types"

export interface MarketInstance extends Model<MarketAttributes>, MarketAttributes {}

const Market = sequelize.define<MarketInstance>("Market", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  security: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "uniqueSecurityTimestamp", // Ensure unique entry per security per timestamp
    comment: "The security symbol or name (e.g., MTNR, BKGR)",
  },
  closing: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: "Closing price of the security",
  },
  previous: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: "Previous closing price of the security",
  },
  change: {
    type: DataTypes.DECIMAL(5, 2), // Storing as a number for calculations
    allowNull: false,
    comment: "Percentage change in price",
  },
  volume: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: "Total volume traded",
  },
  value: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: "Total value traded",
  },
  scrapedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: "uniqueSecurityTimestamp", // Ensure unique entry per security per timestamp
    defaultValue: DataTypes.NOW,
    comment: "Timestamp when the data was scraped",
  },
})

export default Market