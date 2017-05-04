// @flow
import { fromGlobalId, nodeDefinitions } from "graphql-relay";

import personType from "./types/personType";
import { getObjectFromTypeAndId } from "./apiHelper";

export function idFetcher(globalId: string, context?: Object): Object | null {
  const { type, id } = fromGlobalId(globalId);
  if (type === "Person") {
    return getObjectFromTypeAndId(personType, id, context);
  }
  return null;
}

export function typeResolver(object: { GraphQLType?: Object }): Object | null {
  if (object.GraphQLType === personType.name) {
    return personType;
  }
  return null;
}

const { nodeInterface, nodeField } = nodeDefinitions(idFetcher, typeResolver);

export { nodeInterface, nodeField };
