import database from "../databaseConnection";
import { STRING, INTEGER } from "sequelize";

const Planet: sequelize = database.define("planet", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: STRING, allowNull: false },
  diameter: { type: INTEGER },
  rotationPeriod: { type: INTEGER },
  orbitalPeriod: { type: INTEGER },
  gravity: { type: STRING },
  population: { type: INTEGER },
  climates: { type: STRING },
  terrains: { type: STRING },
  surfaceWater: { type: INTEGER }
});

export default Planet;
