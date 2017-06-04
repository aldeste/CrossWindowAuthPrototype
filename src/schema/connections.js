// @flow

/**
 * Connections in GraphQL are relations to other graphql types.
 */

import {
  connectionFromArray,
  connectionArgs,
  connectionDefinitions
} from "graphql-relay";
import { getObjectsByType } from "./apiHelper";
import {
  type GraphQLObjectType,
  type GraphQLFieldConfig,
  GraphQLInt
} from "graphql";

// Connection factory creating connections based on graphql types.
export function connectionFromType(
  name: string,
  type: GraphQLObjectType,
  idField: string
): GraphQLFieldConfig<*, *> {
  // Generate a graphql connection defenition type.
  const { connectionType } = connectionDefinitions({
    name,
    nodeType: type,
    resolveNode: edge => edge.node,
    connectionFields: () => ({
      currentCount: {
        type: GraphQLInt,
        resolve: conn => conn.currentCount,
        description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`
      }
    })
  });

  return {
    type: connectionType,
    args: connectionArgs,
    resolve: async (currentType: Object, args: Object, context: Object) => {
      const { objects, currentCount } = await getObjectsByType(
        type,
        args,
        context,
        // currentType[idField] is the main field responsable for
        // resolving the connection. The current connection parent
        // in use must expose an array of ids of each connection.
        currentType[idField]
      );
      return {
        // Object exposing an array of each element in connection, resolved.
        ...connectionFromArray(objects, args),
        currentCount
      };
    }
  };
}
