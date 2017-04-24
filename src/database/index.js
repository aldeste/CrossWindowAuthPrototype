// @flow
import connection from "./databaseConnection";
import { Person } from "./modules";
import chalk from "chalk";

/**
 * We define relations here, so they'll be defined before
 * databse is syncronised and included in the export.
 */
// Planet.hasMany(Person, {
//   constraints: false,
//   as: "habitants"
// });

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

if (process.env.NODE_ENV !== "production") {
  connection.sync({ force: true }).then(async () => {
    type TypesOfDummyData = {
      peopleDummy: Array<Object>
    };

    const { peopleDummy }: TypesOfDummyData = require("./dummy/");

    const personsInDatabase: Number = await Person.count();

    if (personsInDatabase !== peopleDummy.length) {
      await Promise.all(
        peopleDummy.map(({ node: person }) =>
          Person.create({ ...person, id: null, password: "password" })
        )
      );

      // await Promise.all(
      //   peopleDummy.map(async (person, index) => {
      //     const homeworld = planetsDummy.find(
      //       p => p.id === person.node.homeworld.id
      //     );
      //     const planet = await Planet.find({
      //       where: {
      //         name: homeworld && homeworld.name
      //       }
      //     });
      //
      //     return !!planet && planet.setHabitants([index + 1]);
      //   })
      // );

      return console.log(
        chalk.green.bold("All fields and connections are inserted")
      );
    }
    console.log(chalk.yellow.bold("Fields already in database, have fun."));
  });
}

export default connection;
export { Person };
