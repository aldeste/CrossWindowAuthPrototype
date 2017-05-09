// @flow
import chalk from "chalk";
import { toGlobalId } from "graphql-relay";
import { Person } from "./";

export default async function generateMockData(
  forceInsert: boolean = false
): Promise<void> {
  if (forceInsert || (await Person.count()) === 0) {
    const { peopleDummy } = require("./dummy");

    await Promise.all(
      peopleDummy.map((person, index) =>
        Person.create({
          ...person,
          id: null,
          token: toGlobalId("people", index + 1),
          password: "password",
          hairColor: person.hair_color,
          skinColor: person.skin_color,
          eyeColor: person.eye_color,
          birthYear: person.birth_year
        })
      )
    );

    return console.log(
      chalk.green.bold("All fields and connections are inserted")
    );
  }
  return console.log(chalk.yellow.bold("Fields already in database, have fun"));
}
