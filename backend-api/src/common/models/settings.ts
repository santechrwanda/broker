// models/Setting.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./users";

const Setting = sequelize.define("Setting", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  defaultPassword: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: "en",
    allowNull: false,
  },
  theme: {
    type: DataTypes.ENUM("light", "dark"),
    defaultValue: "light",
    allowNull: false,
  },
  notificationsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
});

Setting.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

User.hasOne(Setting, {
    foreignKey: "userId",
    as: "settings",
    onDelete: "CASCADE",
});

export default Setting;
