/* @flow */
import DataLoader from "dataloader";
import chalk from "chalk";
import { Person as dbPerson, Planet as dbPlanet } from "../data";
import User, { type Viewer } from "../models/User";
import Planet from "../models/Planet";

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
export function getResolve(
  type: Class<*>,
  ids: Array<string>,
  options: Object = {}
): Promise<*> {
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
      return type.scope("withIds").findById(id, options);
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
    Person: new DataLoader(ids => getResolve(dbPerson, ids)),
    Planet: new DataLoader(ids => getResolve(dbPlanet, ids))
  };

  return {
    Person: (id: string): Promise<?User> =>
      User.gen(Viewer || null, id, loaders),
    PersonConnection: ids => User.genMany(Viewer || null, ids, loaders),
    Planet: (id: string): Promise<?Object> =>
      Planet.gen(Viewer || null, id, loaders)
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
