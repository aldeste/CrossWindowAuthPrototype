// @flow
import database from "../databaseConnection";
import { STRING, INTEGER } from "sequelize";

export default database.define("species", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: STRING },
  classification: { type: STRING },
  designation: { type: STRING },
  averageHeight: { type: INTEGER },
  averageLifespan: { type: INTEGER },
  eyeColors: { type: STRING },
  hairColors: { type: STRING },
  skinColors: { type: STRING },
  language: { type: STRING }
});
