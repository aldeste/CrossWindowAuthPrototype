// @flow
import database from "../databaseConnection";
import { STRING, INTEGER, TEXT } from "sequelize";

// Representation of a film structure for sequelize.
// NOTE: Currently not implemented
export default database.define("flim", {
  id: { type: INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: STRING },
  episodeID: { type: INTEGER },
  openingCrawl: { type: TEXT },
  director: { type: STRING },
  producers: { type: STRING },
  releaseDate: { type: STRING }
});
