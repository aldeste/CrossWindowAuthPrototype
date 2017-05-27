import database from "../databaseConnection";
import { STRING, INTEGER, FLOAT, VIRTUAL } from "sequelize";

const Planet = database.define("planet", {
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

export default Planet;
