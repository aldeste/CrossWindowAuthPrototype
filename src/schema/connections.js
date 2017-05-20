/* @flow */
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

export function connectionFromType(
  name: string,
  type: GraphQLObjectType,
  idField: string
): GraphQLFieldConfig<*, *> {
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
    resolve: async (currentType: Object, args: Object, ctx: Object) => {
      const { objects, currentCount } = await getObjectsByType(
        type,
        args,
        ctx,
        currentType[idField].map(x => x.id)
      );
      return {
        ...connectionFromArray(objects, args),
        currentCount
      };
    }
  };
}
