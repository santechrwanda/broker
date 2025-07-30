import { Sequelize } from "sequelize"
import logger from "@/common/config/logger"
import { env } from "@/common/config/envConfig"

const isDevelopment = env.isDevelopment

// Build Sequelize options
const sequelizeOptions: any = {
  host: env.DB_HOST,
  port: Number(env.DB_PORT || "3306"),
  dialect: "mysql",
  logging: false,
}

// Add dialectOptions only if NOT in development
if (!isDevelopment) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      rejectUnauthorized: true,
    },
  }
}

// Initialize Sequelize instance
const sequelize = new Sequelize(env.DB_NAME || "", env.DB_USER || "", env.DB_PASSWORD, sequelizeOptions)

// Connection initializer
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate()
    // Ensure all models are loaded before syncing
    // User, Company, Market, Commission, Setting, UserShare, Transaction are imported above
    await sequelize.sync({ alter: true }) // Use alter: true for non-destructive updates
    logger.info("Connection to the database has been established successfully.")
  } catch (error) {
    console.error(error)
    logger.error("Unable to connect to the database:", error)
    process.exit(1)
  }
}

export default sequelize
