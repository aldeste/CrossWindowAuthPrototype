// @flow
import { GraphQLID, GraphQLObjectType, GraphQLSchema } from "graphql";
import { fromGlobalId } from "graphql-relay";
import { nodeField } from "./relayNode";
import personType from "./types/personType";
import { getObjectFromTypeAndId } from "./apiHelper";

// The main query root type of the graphql schema. This is a
// layout which will be used to resolve incomming graphql requests.
const Root = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    viewer: {
      type: personType,
      description:
        "The viewr field is associated with the currently logged in viewer.",
      // Resolvers define how the specified field should resolve.
      resolve: (
        source: Object,
        args: { [arg: string]: string },
        context: Object
      ): Promise<Object> | null => {
        // If context passes a viewer, we know that an authorized
        // user is present, and we can proceed. Otherwise return null
        if (context.viewer && context.viewer.personId) {
          return getObjectFromTypeAndId(
            personType,
            context.viewer.personId,
            context
          );
        }
        return null;
      }
    },
    person: {
      type: personType,
      description:
        "A person field to be used to query for people by id or personId",
      args: {
        id: { type: GraphQLID },
        personId: { type: GraphQLID }
      },
      resolve(
        source: Object,
        args: { personId?: ?string, id?: ?string },
        context: Object
      ): Object {
        // Get only by ID, storing type and context in getter.
        const getter = (id: string) =>
          getObjectFromTypeAndId(personType, id, context);
        const { personId, id: globalId } = args;

        // If personId is inserted and is string, resolve based on this id.
        if (personId && typeof personId === "string") {
          return getter(personId);
        }

        // If globalId is passed and is string...
        if (globalId && typeof globalId === "string") {
          // ...get type and id from it...
          const { id, type } = fromGlobalId(globalId);

          if (id === "" || type === "") {
            throw new Error(`No valid ID extracted from ${globalId}`);
          }

          // ...and resolve based on this value.
          return getter(id);
        }

        // throw error if no argumetns entered
        throw new Error(`You must provide id or personId`);
      }
    },
    // The node field exposes a graphql relay
    // interface, usable if using the relay framework
    node: nodeField
  })
});

export default new GraphQLSchema({ query: Root });
