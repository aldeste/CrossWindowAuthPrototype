// @flow
import database from "../databaseConnection";
import { STRING, INTEGER, VIRTUAL } from "sequelize";

const Person = database.define("person", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  birthYear: { type: STRING, allowNull: false },
  eyeColor: { type: STRING, allowNull: false },
  gender: { type: STRING },
  hairColor: { type: STRING },
  height: { type: INTEGER },
  mass: { type: INTEGER },
  name: { type: STRING, allowNull: false },
  skinColor: { type: STRING },
  // Customs
  password: { type: STRING, allowNull: false },
  token: { type: STRING, allowNull: false },
  GraphQLType: {
    type: VIRTUAL,
    get: () => "Person"
  }
});

export default Person;
