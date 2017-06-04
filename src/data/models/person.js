// @flow
import database from "../databaseConnection";
import { STRING, INTEGER, VIRTUAL } from "sequelize";

// Representation of a user structure for sequelize.
export default database.define("person", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  birthYear: { type: STRING, allowNull: false },
  eyeColor: { type: STRING, allowNull: false },
  gender: { type: STRING },
  hairColor: { type: STRING },
  height: { type: INTEGER },
  mass: { type: INTEGER },
  name: { type: STRING, allowNull: false },
  skinColor: { type: STRING },
  // Customs, not obtainable from mock database
  password: { type: STRING, allowNull: false },
  token: { type: STRING, allowNull: false },
  GraphQLType: {
    type: VIRTUAL,
    get: () => "Person"
  }
});

// Flowtype defenition of the database connection layer
export type PersonModel = {
  createdAt: Date,
  updatedAt: Date,
  id: string,
  GraphQLType: string,
  birthYear: string,
  eyeColor: string,
  gender: string,
  hairColor: string,
  height: number,
  mass: number,
  name: string,
  skinColor: string,
  password: string,
  token: string,
  homeworld: {
    id: number
  }
};
