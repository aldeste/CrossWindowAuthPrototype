const APP_PORT = process.env.APP_PORT || process.env.NODE_ENV === "test"
  ? "3000"
  : "2000";
const APP_HOST = process.env.APP_HOST || "localhost";
const APP_PROTOCOL = process.env.APP_PROTOCOL || "http";
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || "3306";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "password";
const DB_NAME = process.env.DB_NAME || "authjazz";

module.exports = {
  APP_PORT,
  APP_HOST,
  APP_PROTOCOL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME
};
