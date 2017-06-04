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

// This resolves a query to each id, batching the array into a single
// fetch. this function is memoized as a response to DataLoader,
// meaning the same ID won't be fetched twice in the same query.
export function getResolve(
  type: Class<*>,
  ids: Array<string>
): Promise<Array<Object>> {
  // return a promise with each field to resolve
  return Promise.all(
    // Loop thourgh every ID field and generate database queries
    ids.map(id => {
      // We console log each request to ilustrate how dataloader works.
      // If the same reqouse is requisted twice durning the same request
      // it'll still only fetch once, since the result is memoized.
      console.log(
        chalk.bold.magenta(
          "Fetched",
          chalk.yellow.italic(type.name),
          "with id",
          chalk.yellow.italic(id),
          "from database"
        )
      );

      // Return promise to find by id
      return type.scope("withIds").findById(id).then(data => data.toJSON());
    })
  );
}

// A factory to create DataLoader memoized database calls. Best
// practice is to create each per request, this will help if
// same data is fetched multiple times durning the same request.
export function createLoaders(Viewer: ?Viewer): Loaders {
  // Generate a dataloader per field.
  const loaders: DataLoaders = {
    Person: new DataLoader(ids => getResolve(dbPerson, ids)),
    Planet: new DataLoader(ids => getResolve(dbPlanet, ids))
  };

  // Expose each busines layer generator, ember dataloader in each one.
  return {
    Person: (id: string): Promise<?User> =>
      User.gen(Viewer || null, id, loaders),

    PersonConnection: (ids: Array<string>): Promise<?Array<User>> =>
      User.genMany(Viewer || null, ids, loaders),

    Planet: (id: string): Promise<?Object> =>
      Planet.gen(Viewer || null, id, loaders)
  };
}

// Given a type and ID, get the object with the ID.
export async function getObjectFromTypeAndId(
  type: Object,
  id: string,
  context?: Object
): Promise<Object> {
  // Generate loaders if none were embeded in context,
  // otherwise use the loaders embedded in context
  const Loaders = (context && context.loaders) || createLoaders();
  // Returns resolved loader result
  return await Loaders[type.name](id);
}

// Given a type, fetch all objects
export async function getObjectsByType(
  type: GraphQLObjectType,
  args?: ?Object,
  context: { loaders: Loaders },
  ids: Array<string>
): Promise<Object> {
  // Generate loaders if none were embeded in context,
  // otherwise use the loaders embedded in context
  const Loaders = (context && context.loaders) || createLoaders();

  // Await for each id in connection to resolve, then return
  const objects = await Loaders[type.name + "Connection"](ids);
  return { objects, currentCount: objects.length };
}
