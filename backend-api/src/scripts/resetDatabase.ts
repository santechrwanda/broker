import sequelize, { initializeDatabase } from "@/common/config/database"
import logger from "@/common/config/logger"
import { env } from "@/common/config/envConfig"
import Transaction from "@/common/models/transaction"
import Market from "@/common/models/market"
import Wallet from "@/common/models/wallet"
import WalletTransaction from "@/common/models/walletTransaction"
import Setting from "@/common/models/settings"
import User from "@/common/models/users"
import UserShare from "@/common/models/userShare"
import Commission from "@/common/models/commission"
import Company from "@/common/models/company"

async function resetDatabase() {
  if (env.NODE_ENV === "production") {
    logger.warn("Database reset is disabled in production environment to prevent accidental data loss.")
    process.exit(1)
  }

  logger.info("Starting database reset...")

  try {
    // Authenticate with the database first
    await sequelize.authenticate()
    logger.info("Database connection authenticated.")

    // Log the actual database being used
    const config = sequelize.config
    logger.info(`Connected to database: ${config.database} on ${config.host}:${config.port}`)

    // List existing tables before dropping
    const tableNames = await sequelize.getQueryInterface().showAllTables()
    logger.info(`Tables before drop: ${JSON.stringify(tableNames)}`)

    // Drop all tables
    // { cascade: true } ensures that tables with foreign key constraints are dropped correctly

    //TRANSACTOION
    await Transaction.drop({ cascade: true });

    //MARKET
    await Market.drop({ cascade: true });

    // WALLET TRANSACTIONS
    await WalletTransaction.drop({ cascade: true });

    // WALLET
    await Wallet.drop({ cascade: true });

    // SETTINGS
    await Setting.drop({ cascade: true });

    // USER SHARES
    await UserShare.drop({ cascade: true });

    // COMMISSION
    await Commission.drop({ cascade: true });

    // COMPANY
    await Company.drop({ cascade: true });

    // USER
    await User.drop({ cascade: true });

    logger.info("All tables dropped successfully.")

    // Verify tables are actually dropped
    const remainingTables = await sequelize.getQueryInterface().showAllTables()
    logger.info(`Remaining tables after drop: ${JSON.stringify(remainingTables)}`)

    // Re-sync all models to recreate tables with the latest schema
    // initializeDatabase already calls sequelize.sync({ alter: true })
    await sequelize.sync({ force: true }) // <-- use force instead of alter
    logger.info("Database schema recreated successfully.")

    logger.info("Database reset completed!")
  } catch (error) {
    logger.error(`Error during database reset: ${(error as Error).message}`)
    process.exit(1)
  } finally {
    // Close the database connection
    await sequelize.close()
    logger.info("Database connection closed.")
  }
}

// Execute the reset function
resetDatabase()
