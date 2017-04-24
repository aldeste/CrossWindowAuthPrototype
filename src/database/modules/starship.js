// @flow
import database from "../databaseConnection";
import { STRING, INTEGER, BIGINT } from "sequelize";

export default database.define("starship", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: STRING },
  model: { type: STRING },
  starshipClass: { type: STRING },
  manufacturers: { type: STRING },
  costInCredits: { type: BIGINT.UNSIGNED },
  length: { type: INTEGER.UNSIGNED },
  crew: { type: STRING },
  passengers: { type: STRING },
  maxAtmospheringSpeed: { type: INTEGER.UNSIGNED },
  hyperdriveRating: { type: INTEGER.UNSIGNED },
  MGLT: { type: INTEGER.UNSIGNED },
  cargoCapacity: { type: BIGINT.UNSIGNED },
  consumables: { type: STRING }
});
