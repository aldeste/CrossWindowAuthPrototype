// @flow
import connection from "./databaseConnection";
import { Person, Planet } from "./models";
import generateMockData from "./generateMockData";

/**
 * We define relations here, so they'll be defined before
 * databse is syncronised and included in the export.
 */
Planet.belongsToMany(Person, {
  // constraints: false,
  as: "residents",
  through: "residents"
});

Person.belongsTo(Planet, {
  // constraints: false,
  as: "homeworld"
});

/**
 * Scopes define additional sequelize settings which are
 * callable when fetching from the database. defaultScope
 * is always applied unless another scope is choosen.
 */
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

export async function initializeDatabase(): Promise<void> {
  await connection.sync({ force: true });
  await generateMockData(true, process.env.NODE_ENV !== "test");
}

export default connection;
export { Person, Planet };
