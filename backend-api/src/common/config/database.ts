import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

if(!process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_NAME){
    throw new Error("These environments are necessary.")
}

const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    // dialectOptions: {
    //   ssl: {
    //     rejectUnauthorized: true,
    //   },
    // },
    logging: false,
  }
);

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    logger.info(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.log(error);
    logger.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the process with failure
  }
};

export default sequelize;
