// @flow
import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema
} from "graphql";
//
// import { typeToGraphQLType, nodeField } from "./relayNode";
// /**
//  * Creates a root field to get an object of a given type.
//  * Accepts either `id`, the globally unique ID used in GraphQL,
//  * or `idName`, the per-type ID used in SWAPI.
//  */
// function rootFieldByID(idName: string, type: string) {
//   const getter = (id, ctx) => getObjectByTypeAndId(type, id, ctx);
//   return {
//     type: typeToGraphQLType(type),
//     args: {
//       id: { type: GraphQLID },
//       [idName]: { type: GraphQLID }
//     },
//     resolve: (_, args, ctx) => {
//       if (args[idName] !== undefined && args[idName] !== null) {
//         return getter(args[idName], ctx);
//       }
//
//       if (args.id !== undefined && args.id !== null) {
//         const globalId = fromGlobalId(args.id);
//         if (
//           globalId.id === null ||
//           globalId.id === undefined ||
//           globalId.id === ""
//         ) {
//           throw new Error(`No valid ID extracted from ${args.id}`);
//         }
//         return getter(globalId.id, ctx);
//       }
//
//       throw new Error(`You must provide id or ${idName}`);
//     }
//   };
// }

const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    // viewer: {
    //   ...rootFieldByID("personID", "people"),
    // },
    example: {
      type: GraphQLInt
    }
    // node: nodeField
  })
});

export default new GraphQLSchema({ query: Query });
