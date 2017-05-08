import database from "../databaseConnection";
import { STRING, INTEGER, VIRTUAL } from "sequelize";

const Person = database.define("person", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: STRING, allowNull: false },
  password: { type: STRING, allowNull: false },
  token: { type: STRING, allowNull: false },
  birthYear: { type: STRING, allowNull: false },
  eyeColor: { type: STRING, allowNull: false },
  GraphQLType: {
    type: VIRTUAL,
    get() {
      return "Person";
    }
  }
});

export default Person;
