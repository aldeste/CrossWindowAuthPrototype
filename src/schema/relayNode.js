import { fromGlobalId, nodeDefinitions } from "graphql-relay";

import personType from "./types/personType";
import { getObjectFromTypeAndId } from "./apiHelper";

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, ctx) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === "Person") {
      return getObjectFromTypeAndId(personType, id, ctx);
    }
    return null;
  },
  obj => {
    if (obj.GraphQLType === "personType") {
      return personType;
    }
    return null;
  }
);

export { nodeInterface, nodeField };
