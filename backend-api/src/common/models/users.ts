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
        },
        comment: "Name field is required."
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        comment: "Email field is required."
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
        },
    },
    role: {
        type: DataTypes.ENUM("client", "admin", "teller", "agent", "manager", "accountant", "company"),
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

    // New fields:
    salary: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
        },
    },
    commission: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            max: 100,
        },
        comment: "Percentage value (e.g., 5 for 5%)",
    },
    profile: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
      isCustomUrl(value: string) {
        if (
          value &&
          !/^https?:\/\/(localhost|127\.0\.0\.1|\S+\.\S+)(:\d+)?(\/\S*)?$/.test(
            value
          )
        ) {
          throw new Error(
            "Profile must be a valid URL including localhost or domain."
          );
        }
      },
    },
        comment: "The profile Image should be correct url link."
    }
});

export default User;
