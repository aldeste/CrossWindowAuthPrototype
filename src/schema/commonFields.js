/* @flow */
import { GraphQLString, type GraphQLFieldConfig } from "graphql";

export function createdField(): GraphQLFieldConfig<*, *> {
  return {
    type: GraphQLString,
    description: "The ISO 8601 date format of the time that this resource was created."
  };
}

export function editedField(): GraphQLFieldConfig<*, *> {
  return {
    type: GraphQLString,
    description: "The ISO 8601 date format of the time that this resource was edited."
  };
}
