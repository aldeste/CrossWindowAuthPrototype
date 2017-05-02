// @flow
import { GraphQLInt, GraphQLObjectType, GraphQLSchema } from "graphql";

import { nodeField } from "./relayNode";

const Root = new GraphQLObjectType({
  name: "Root",
  fields: () => ({
    viewer: {
      type: GraphQLInt,
      resolve: () => 3
    },
    node: nodeField
  })
});

export default new GraphQLSchema({ query: Root });
