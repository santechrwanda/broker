import sequelize, { initializeDatabase } from "@/common/config/database"
import logger from "@/common/config/logger"
import { env } from "@/common/config/envConfig"

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

    // Drop all tables
    // { cascade: true } ensures that tables with foreign key constraints are dropped correctly
    await sequelize.drop({ cascade: true })
    logger.info("All tables dropped successfully.")

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
