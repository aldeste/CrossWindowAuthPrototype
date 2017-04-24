// @flow
import Sequelize from "sequelize";
import {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_PORT
} from "../../config/config";

const connection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  ...(process.env.NODE_ENV !== "production"
    ? {
        dialect: "sqlite",
        storage: require("path").join(__dirname, `/${DB_NAME}.sqlite`)
      }
    : {
        dialect: "mariadb",
        host: DB_HOST,
        port: DB_PORT
      }),
  logging: false,
  define: {
    underscored: false,
    freezeTableName: false,
    syncOnAssociation: true,
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    timestamps: true
  }
});

export default connection;
