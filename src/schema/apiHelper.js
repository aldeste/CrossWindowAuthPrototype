/* @flow */
import DataLoader from "dataloader";
import chalk from "chalk";

import { Person } from "../database";

/**
 * This resolves a query to each id, batching the array into a
 * single fetch. this function is memoized as a response to DataLoader,
 * meaning the same ID won't be fetched twice in the same query.
 */
export function getResolve(
  authToken?: Object,
  type: Class<*>,
  ids: Array<string | number>
): Promise<*> {
  return Promise.all(
    ids.map(id => {
      console.log(chalk.bold.yellow(`fetched ${type.name} with id ${id}`));
      return type.findById(id).then(result => result.get());
    })
  );
}

/**
 * A factory to create DataLoader memoized database calls. Best
 * practice is to create each per request, this will help if
 * same data is fetched multiple times durning the same request.
 */
export function createLoaders(authToken?: Object): Object {
  return {
    Person: new DataLoader(ids => getResolve(authToken, Person, ids))
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
  return await Loaders[type.name].load(id);
}
