import { DataTypes } from "sequelize";
import sequelize from "@/common/config/database";

const Market = sequelize.define("Market", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    security: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    closing: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    previous: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    change: {
        type: DataTypes.STRING, // e.g. "+0.86", "-0.05", "0.00"
        allowNull: false,
    },
    volume: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    value: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
});

export default Market;