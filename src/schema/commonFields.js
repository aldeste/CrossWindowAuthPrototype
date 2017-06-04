// @flow

/**
 * This file contains fields used by each GraphQL type. Instead
 * of defining them multiple times, they are defined here.
 */

import { GraphQLString, type GraphQLFieldConfig } from "graphql";

export function createdField(): GraphQLFieldConfig<*, *> {
  return {
    type: GraphQLString,
    description:
      "The ISO 8601 date format of the time that this resource was created.",
    resolve: current => current.created
  };
}

export function editedField(): GraphQLFieldConfig<*, *> {
  return {
    type: GraphQLString,
    description:
      "The ISO 8601 date format of the time that this resource was edited.",
    resolve: current => current.edited
  };
}
