// @flow
import { GraphQLID, GraphQLObjectType, GraphQLSchema } from "graphql";
import { fromGlobalId } from "graphql-relay";

import { nodeField } from "./relayNode";
import personType from "./types/personType";
import { getObjectFromTypeAndId } from "./apiHelper";

type arguments = { personId?: ?string, id?: ?string };
type globalIdObejct = { type?: ?string, id?: ?string };

const Root = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    viewer: {
      type: personType,
      description: "The viewr field is associated with the currently logged in viewer.",
      resolve: (
        _: *,
        args: arguments,
        viewer: Object
      ): Promise<Object> | null => {
        if (viewer.viewer && viewer.viewer.personId) {
          return getObjectFromTypeAndId(
            personType,
            viewer.viewer.personId,
            viewer
          );
        }
        return null;
      }
    },
    person: {
      type: personType,
      description: "A person field to be used to query for people by id or personId",
      args: {
        id: { type: GraphQLID },
        personId: { type: GraphQLID }
      },
      resolve(_: *, args: arguments, viewer: Object): Object {
        const getter = (id: string) =>
          getObjectFromTypeAndId(personType, id, viewer);
        const { personId, id: globalId } = args;

        if (typeof personId === "string") {
          return getter(personId);
        }

        if (typeof globalId === "string") {
          const { id, type }: globalIdObejct = fromGlobalId(globalId);
          if (!id || id === "" || type === "") {
            throw new Error(`No valid ID extracted from ${globalId}`);
          }

          return getter(id);
        }
        throw new Error(`You must provide id or personId`);
      }
    },
    node: nodeField
  })
});

export default new GraphQLSchema({ query: Root });
