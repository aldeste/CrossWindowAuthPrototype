// @flow
import Sequelize from "sequelize";
import {
  DB_USER,
  DB_PASS,
  DB_NAME,
  CONNECTION_SETTINGS
} from "../../config/config";

// Sequelize connection settings.
const connection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  // Disable logging, since it'as intrucive and obnoxiously loud
  logging: false,
  define: {
    underscored: false,
    freezeTableName: false,
    syncOnAssociation: true,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    timestamps: true
  },
  ...CONNECTION_SETTINGS
});

export default connection;
