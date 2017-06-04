// @flow
import { graphql } from "graphql";
import chalk from "chalk";
import schema from "../schema";
import { Person } from "../data";
import { createLoaders } from "../schema/apiHelper";

export type UserToken = {
  name: string,
  id: string,
  token: string,
  personId: string
};

type validationParameters = {
  name: string,
  password: string
};

// Validate user from a token, effectively signing them in.
export async function fromAuthToken(token: string): UserToken | {} {
  type responseType = { data: { person: UserToken } } | Object;

  // Use graphql to fetch personal data based on token.
  const response: responseType = await graphql(
    schema,
    `{ person(id: "${token}") { personId name token id } }`,
    {},
    { loaders: createLoaders() }
  );

  if (response.data.person) {
    // Notify the console that a person has been recieved and authorized.
    console.log(
      chalk.bold.blue("You're authorized as", response.data.person.name)
    );
    // Return user if authorized
    return response.data.person;
  }

  // Return empty object if user doesn't have a token, or if fetch failed.
  return {};
}

// Validate user by name and password.
export async function validateUser({
  // Destructure name from argument
  name,
  // Destructure password from argument
  password
}: validationParameters): Promise<UserToken | { error: string }> {
  // Attempt a login in a try catch
  try {
    // Resolve by username and password, getting
    // neccessary info from database connection.
    const user: UserToken | null = await Person.findOne({
      where: { name },
      attributes: ["id", "name", "token", "password"]
    });

    // Throw friendly error if opperation failed.
    if (user === null || user === undefined) {
      throw new Error("Failed to sign in due to invalid results");
    }

    // Throw friendly error if password didn't match.
    if (user.password !== password) {
      throw new Error("Failed to sign in user due to password missmatch");
    }

    // Return user.
    return {
      id: user.token,
      name: user.name,
      personId: user.id,
      token: user.token
    };
  } catch (error) {
    // Return error if try-catch failed.
    return { error: error.message };
  }
}
