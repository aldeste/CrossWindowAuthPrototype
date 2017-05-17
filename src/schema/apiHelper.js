/* @flow */
import DataLoader from "dataloader";
import chalk from "chalk";
import { Person } from "../database";
import User, { type Viewer } from "../service/User";

export type Loaders = {
  Person: Function
};

export type DataLoaders = {
  Person: DataLoader<*, *>
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
    Person: new DataLoader(ids => getResolve(Person, ids))
  };

  return {
    Person: (id: string): Promise<?User> =>
      User.gen(Viewer || null, id, loaders)
  };
}

/**
 * Given a type and ID, get the object with the ID.
 */
export async function getObjectFromTypeAndId(
  type: Object,
  id: string,
  viewer?: Object
): Promise<Object> {
  const Loaders = (viewer && viewer.loaders) || createLoaders();
  return await Loaders[type.name](id);
}
