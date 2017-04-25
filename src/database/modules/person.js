import database from "../databaseConnection";
import { STRING, INTEGER } from "sequelize";

const Person: sequelize = database.define("person", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: STRING, allowNull: false },
  password: { type: STRING, allowNull: false },
  token: { type: STRING, allowNull: false },
  birthYear: { type: STRING, allowNull: false },
  eyeColor: { type: STRING, allowNull: false }
});

export default Person;
