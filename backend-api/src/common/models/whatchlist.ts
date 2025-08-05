import { DataTypes, type Model } from "sequelize"
import sequelize from "../config/database"
import User from "./users"
import Market from "./market"
import type { WatchlistAttributes } from "../utils/types"

export interface WatchlistInstance extends Model<WatchlistAttributes>, WatchlistAttributes {}

const Watchlist = sequelize.define<WatchlistInstance>(
  "Watchlist",
  {
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
      comment: "The user who owns this watchlist entry",
    },
    marketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Market,
        key: "id",
      },
      comment: "The market security added to the watchlist",
    },
    addedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Timestamp when the market security was added to the watchlist",
    },
  },
  {
    // Ensure a user can only add a specific market entry once
    indexes: [
      {
        unique: true,
        fields: ["userId", "marketId"],
      },
    ],
  },
)

// Define associations
Watchlist.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
})

Watchlist.belongsTo(Market, {
  foreignKey: "marketId",
  as: "market",
})

User.hasMany(Watchlist, {
  foreignKey: "userId",
  as: "watchlist",
})

Market.hasMany(Watchlist, {
  foreignKey: "marketId",
  as: "watchlistEntries",
})

export default Watchlist
