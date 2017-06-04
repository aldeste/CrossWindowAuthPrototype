// @flow
import connection from "./databaseConnection";
import { Person, Planet } from "./models";
import generateMockData from "./generateMockData";

// We define relation here, so they'll be defined before
// databse is syncronised and included in the export.
Planet.belongsToMany(Person, {
  as: "residents",
  through: "residents"
});

Person.belongsTo(Planet, {
  as: "homeworld"
});

// Scopes define additional sequelize settings which are
// callable when fetching from the database. defaultScope
// is always applied unless another scope is choosen.
Person.addScope(
  "withIds",
  { include: [{ model: Planet, as: "homeworld", attributes: ["id"] }] },
  { override: true }
);

Planet.addScope(
  "withIds",
  { include: [{ model: Person, as: "residents", attributes: ["id"] }] },
  { override: true }
);

// Initialize the database.
export async function initializeDatabase(): Promise<void> {
  // Syncronize database with databse settings, optionally
  // force syncronization or not. I've choosen to force it,
  // since database is stored in memory and will wipe each rerun
  await connection.sync({ force: true });
  // Generate mock data, choosing wether to
  // force it, and wether to expose progress bar
  await generateMockData(true, process.env.NODE_ENV !== "test");
}

export default connection;
export { Person, Planet };
