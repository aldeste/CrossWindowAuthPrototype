// @flow
import connection from "./databaseConnection";
import { Person, Planet } from "./models";
import generateMockData from "./generateMockData";

/**
 * We define relations here, so they'll be defined before
 * databse is syncronised and included in the export.
 */
Planet.hasMany(Person, {
  constraints: false,
  as: "habitants"
});

/**
 * Scopes define additional sequelize settings which are
 * callable when fetching from the database. defaultScope
 * is always applied unless another scope is choosen.
 */
// Planet.addScope(
//   "defaultScope",
//   {
//     include: [{ model: Person, as: "habitants" }]
//   },
//   { override: true }
// );

export async function initializeDatabase(): Promise<*> {
  await connection.sync({ force: false });
  return generateMockData();
}

export default connection;
export { Person, Planet };
