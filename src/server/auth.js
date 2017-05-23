// @flow
import { graphql } from "graphql";
import chalk from "chalk";
import schema from "../schema";
import { Person } from "../database";
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

export async function fromAuthToken(token: string): UserToken | {} {
  type responseType = { data: { person: UserToken } } | Object;

  const response: responseType = await graphql(
    schema,
    `{ person(id: "${token}") { personId name token id } }`,
    {},
    { loaders: createLoaders() }
  );

  if (response.data.person) {
    console.log(
      chalk.bold.blue("You're authorized as", response.data.person.name)
    );
    return response.data.person;
  }

  // Return empty object if user doesn't have a token
  return {};
}

export async function validateUser({
  name,
  password
}: validationParameters): Promise<UserToken | { error: string }> {
  try {
    const user: UserToken | null = await Person.findOne({
      where: { name },
      attributes: ["id", "name", "token", "password"]
    });

    if (user === null || user === undefined) {
      throw new Error("Failed to sign in due to invalid results");
    }

    if (user.password !== password) {
      throw new Error("Failed to sign in user due to password missmatch");
    }

    return {
      id: user.token,
      name: user.name,
      personId: user.id,
      token: user.token
    };
  } catch (error) {
    return { error: error.message };
  }
}
