/* @flow */
import DataLoader from "dataloader";
import chalk from "chalk";
import { Person, Planet } from "../data";
import User, { type Viewer } from "../models/User";

import { type GraphQLObjectType } from "graphql";

export type Loaders = {
  Person: Function,
  Planet: Function
};

export type DataLoaders = {
  Person: DataLoader<*, *>,
  Planet: DataLoader<*, *>
};

/**
 * This resolves a query to each id, batching the array into a
 * single fetch. this function is memoized as a response to DataLoader,
 * meaning the same ID won't be fetched twice in the same query.
 */
export function getResolve(type: Class<*>, ids: Array<string>): Promise<*> {
  return Promise.all(
    ids.map(id => {
      // We console log each request to ilustrate how dataloader works,
      // If the same reqouse is requisted twice durning the same request
      // it'll still only consol log once, since the result is memoized.
      console.log(
        chalk.bold.magenta(
          "Fetched",
          chalk.yellow.italic(type.name),
          "with id",
          chalk.yellow.italic(id),
          "from database"
        )
      );
      return type.findById(id);
    })
  );
}

/**
 * A factory to create DataLoader memoized database calls. Best
 * practice is to create each per request, this will help if
 * same data is fetched multiple times durning the same request.
 */
export function createLoaders(Viewer: ?Viewer): Loaders {
  const loaders: DataLoaders = {
    Person: new DataLoader(ids => getResolve(Person, ids)),
    // Planet: new DataLoader(ids => getResolve(Planet, ids))
    Planet: new DataLoader(ids =>
      Promise.all(
        ids.map(id =>
          Planet.findById(id, {
            include: [{ model: Person, as: "residents" }]
          })
        )
      )
    )
  };

  return {
    Person: (id: string): Promise<?User> =>
      User.gen(Viewer || null, id, loaders),
    PersonConnection: ids => User.genMany(Viewer || null, loaders, Person, ids),
    Planet: (id: string): Promise<?Object> => loaders.Planet.load(id)
  };
}

/**
 * Given a type and ID, get the object with the ID.
 */
export async function getObjectFromTypeAndId(
  type: Object,
  id: string,
  context?: Object
): Promise<Object> {
  const Loaders = (context && context.loaders) || createLoaders();
  return await Loaders[type.name](id);
}

/**
 * Given a type, fetch all objects
 */
export async function getObjectsByType(
  type: GraphQLObjectType,
  args?: ?Object,
  context: Object,
  ids: Array<string>
): Promise<Object> {
  const Loaders = (context && context.loaders) || createLoaders();
  const objects = await Loaders[type.name + "Connection"](ids);

  return { objects, currentCount: objects.length };
}
