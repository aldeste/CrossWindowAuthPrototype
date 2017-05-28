// @flow
import { fromGlobalId, nodeDefinitions } from "graphql-relay";

import PersonType from "./types/personType";
import PlanetType from "./types/planetType";

import { getObjectFromTypeAndId } from "./apiHelper";

export function idFetcher(
  globalId: string,
  context: Object
): Promise<Object> | null {
  const { type, id } = fromGlobalId(globalId);
  const resolve = (type: Object) => getObjectFromTypeAndId(type, id, context);
  if (type === "people") {
    return resolve(PersonType);
  }
  if (type === "planets") {
    return resolve(PlanetType);
  }
  return null;
}

export function typeResolver(object: { GraphQLType?: Object }): Object | null {
  if (object.GraphQLType === PersonType.name) {
    return PersonType;
  }
  if (object.GraphQLType === PlanetType.name) {
    return PlanetType;
  }
  return null;
}

const { nodeInterface, nodeField } = nodeDefinitions(idFetcher, typeResolver);

export { nodeInterface, nodeField };
