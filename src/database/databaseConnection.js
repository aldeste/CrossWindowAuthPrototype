// @flow
import Sequelize from "sequelize";
import {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_PORT
} from "../../config/config";

const connectionOptions = process.env.NODE_ENV !== "production"
  ? {
      dialect: "sqlite",
      storage: "./db.DELETE_ME_PLEASE.sqlite"
    }
  : {
      dialect: "mariadb",
      host: DB_HOST,
      port: DB_PORT
    };

const connection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  logging: false,
  define: {
    underscored: false,
    freezeTableName: false,
    syncOnAssociation: true,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    timestamps: true
  },
  ...connectionOptions
});

export default connection;
