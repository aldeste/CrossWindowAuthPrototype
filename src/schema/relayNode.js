// @flow

// The relay node interface exposes a
// powerfull, global id based resolve system
import { fromGlobalId, nodeDefinitions } from "graphql-relay";
import PersonType from "./types/personType";
import PlanetType from "./types/planetType";
import { getObjectFromTypeAndId } from "./apiHelper";
import { type GraphQLObjectType } from "graphql";

// Fetches graphql type resolver by a globally unique ID
export function idFetcher(globalId: string, context: Object): ?Promise<Object> {
  // Destructure type and id from global id
  const { type, id } = fromGlobalId(globalId);

  // Function that resolves based on id and context, with type as argument
  const resolve = (type: Object): Promise<Object> =>
    getObjectFromTypeAndId(type, id, context);

  // Based on type from global id, submit type to
  // resolve function if valid, otherwise return null.
  if (type === "people") {
    return resolve(PersonType);
  }
  if (type === "planets") {
    return resolve(PlanetType);
  }
  return null;
}

// Based on fetched result, determine which type to resolve with.
export function typeResolver(result: {
  GraphQLType?: string
}): ?GraphQLObjectType {
  if (result.GraphQLType === PersonType.name) {
    return PersonType;
  }
  if (result.GraphQLType === PlanetType.name) {
    return PlanetType;
  }
  return null;
}

// Destructure nodeInterface and nodeField from nodeDefenitions,
// a graphql-relay helper to resolve based on global id.
const { nodeInterface, nodeField } = nodeDefinitions(idFetcher, typeResolver);

export { nodeInterface, nodeField };
