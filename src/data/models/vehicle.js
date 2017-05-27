// @flow
import database from "../databaseConnection";
import { STRING, INTEGER } from "sequelize";

export default database.define("vehicle", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: STRING },
  model: { type: STRING },
  vehicleClass: { type: STRING },
  manufacturers: { type: STRING },
  costInCredits: { type: INTEGER },
  length: { type: INTEGER },
  crew: { type: STRING },
  passengers: { type: STRING },
  maxAtmospheringSpeed: { type: INTEGER },
  cargoCapacity: { type: INTEGER },
  consumables: { type: STRING }
});
