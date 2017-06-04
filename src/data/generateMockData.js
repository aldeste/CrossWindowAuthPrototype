// @flow
import chalk from "chalk";
import { toGlobalId } from "graphql-relay";
import { Person, Planet } from "../data";
import { peopleDummy, planetsDummy } from "./dummy";
import ProgressBar from "progress";

// Generates data for the database.
export default async function generateMockData(
  forceInsert: boolean = false,
  useProgressBar: boolean = false
): Promise<void> {
  // Force insert based on boolean, or if the database is empty
  if (forceInsert || (await Person.count()) === 0) {
    // Some fields in the mock data are listed as unknown, which will
    // throw when inserting to database. To handle this, each method which
    // could contain an 'unknown' value is passed through this function.
    const isKnown = (val: mixed | null) => (val === "unknown" ? null : val);

    // Padding in the console helps readability
    console.log();

    // Initiallize progress bar if progress bar option is set
    const bar: null | ProgressBar =
      useProgressBar &&
      new ProgressBar("Initiating database :bar :percent :current/:total", {
        complete: "█",
        incomplete: "░",
        clear: true,
        total:
          peopleDummy.length * 2 +
            planetsDummy.length +
            planetsDummy.reduce((p, c) => [...p, ...c.residents], []).length
      });

    // Fill the database with dymmy people
    await Promise.all(
      peopleDummy.map((person: Object, index: number) => {
        // Update progress bar with one tick
        bar && bar.tick(1);
        return Person.create({
          ...person,
          // Set ID to null, since it's inconsistent in the mock data.
          // We'll still be using it futher down to determine connections.
          id: null,
          token: toGlobalId("people", (index + 1).toString()),
          password: "password",
          hairColor: person.hair_color,
          mass: isKnown(person.mass) && parseInt(person.mass, 10),
          height: isKnown(person.height),
          skinColor: person.skin_color,
          eyeColor: person.eye_color,
          birthYear: person.birth_year
        });
      })
    );

    // Fill the database with dymmy planets, similar to what we did with people
    await Promise.all(
      planetsDummy.map((planet: Object) => {
        bar && bar.tick(1);
        return Planet.create({
          ...planet,
          id: null,
          climates: planet.climate,
          population:
            isKnown(planet.population) && parseInt(planet.population, 10),
          terrains: planet.terrain,
          diameter: isKnown(planet.diameter),
          orbitalPeriod: isKnown(planet.orbital_period),
          rotationPeriod: isKnown(planet.rotation_period),
          surfaceWater: isKnown(planet.surface_water)
        });
      })
    );

    // Associate homeworld to each user
    await Promise.all(
      // Loop through each dummy user
      peopleDummy.map(async ({ name, homeworld: home }, index) => {
        // Update progressbar
        bar && bar.tick(1);

        // Find current dummy user in databse
        const currentPerson = await Person.findOne({ where: { name } });

        // Find planet associated with dummy user, based on planet name
        const planet = planetsDummy.find(planet => planet.id === home);

        // Find planet in database, based on dummy planet's name
        const homeworld =
          planet && (await Planet.findOne({ where: { name: planet.name } }));

        // Assign homeworld to user in database
        return currentPerson.setHomeworld(homeworld);
      })
    );

    // Associate habitants to each planet
    await Promise.all(
      planetsDummy.map(async ({ name, residents }, index) => {
        // Update progressbar
        bar && bar.tick(residents.length);

        // Return imediately if planet has no residents
        if (!residents.length) return null;

        // Find current mock planet in database
        const currentPlanet = await Planet.findOne({ where: { name } });

        // Find each person associated to planet mock data
        const planetsResidents = peopleDummy
          .filter(person => residents.includes(person.id))
          .map(resident => resident.name);

        // Find all residents in database
        const residentsInDb = await Person.findAll({
          where: { name: planetsResidents }
        });

        // Add residents to planet in database
        return currentPlanet.addResidents(residentsInDb);
      })
    );

    // Notify console that each element is inserted
    return console.log(
      chalk.green.bold(
        "All fields and connections have been inserted in database"
      )
    );
  }
  // Notify console that each element already is in place
  return console.log(chalk.yellow.bold("Fields already in database, have fun"));
}
