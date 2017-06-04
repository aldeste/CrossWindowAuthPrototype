import database from "../databaseConnection";
import { STRING, INTEGER, FLOAT, VIRTUAL } from "sequelize";

export default database.define("planet", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  climates: { type: STRING },
  diameter: { type: INTEGER },
  gravity: { type: STRING },
  name: { type: STRING, allowNull: false },
  orbitalPeriod: { type: INTEGER },
  population: { type: FLOAT },
  rotationPeriod: { type: INTEGER },
  surfaceWater: { type: INTEGER },
  terrains: { type: STRING },
  GraphQLType: {
    type: VIRTUAL,
    get: () => "Planet"
  }
});

// Flowtype defenition of the database connection layer
export type PlanetModel = {
  createdAt: Date,
  updatedAt: Date,
  id: string,
  GraphQLType: string,
  climates: string,
  diameter: number,
  gravity: string,
  name: string,
  orbitalPeriod: number,
  population: number,
  residents: Array<{ id: string }>,
  rotationPeriod: number,
  surfaceWater: number,
  terrains: string
};
