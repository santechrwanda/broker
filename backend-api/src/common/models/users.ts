import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
        },
    },
    role: {
        type: DataTypes.ENUM("client", "admin", "teller", "agent", "manager"),
        defaultValue: "client",
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("active", "blocked"),
        defaultValue: "active",
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
    },

});

export default User;