// @flow
import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

import { nodeInterface } from "../relayNode";
import { createdField, editedField } from "../commonFields";

/**
 * The GraphQL type equivalent of the People resource
 */
const PersonType = new GraphQLObjectType({
  name: "Person",
  description: "An individual person or character within the Star Wars universe.",
  fields: () => ({
    name: {
      type: GraphQLString,
      description: "The name of this person."
    },
    birthYear: {
      type: GraphQLString,
      resolve: person => person.birthYear,
      description: `The birth year of the person, using the in-universe standard of BBY or ABY -
Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is
a battle that occurs at the end of Star Wars episode IV: A New Hope.`
    },
    eyeColor: {
      type: GraphQLString,
      resolve: person => person.eyeColor,
      description: `The eye color of this person. Will be "unknown" if not known or "n/a" if the
person does not have an eye.`
    },
    gender: {
      type: GraphQLString,
      description: `The gender of this person. Either "Male", "Female" or "unknown",
"n/a" if the person does not have a gender.`
    },
    hairColor: {
      type: GraphQLString,
      resolve: person => person.hairColor,
      description: `The hair color of this person. Will be "unknown" if not known or "n/a" if the
person does not have hair.`
    },
    height: {
      type: GraphQLInt,
      description: "The height of the person in centimeters."
    },
    mass: {
      type: GraphQLInt,
      description: "The mass of the person in kilograms."
    },
    skinColor: {
      type: GraphQLString,
      resolve: person => person.skinColor,
      description: "The skin color of this person."
    },
    password: {
      type: GraphQLString,
      resolve: person =>
        process.env.NODE_ENV !== "production" && person.password,
      description: "The users password, available for testing purpouses."
    },
    token: {
      type: GraphQLString,
      resolve: person => person.token,
      description: "A uniquely identifiable token."
    },
    personId: {
      type: GraphQLString,
      resolve: person => person.id,
      description: "A uniquely identifiable local id."
    },
    created: createdField(),
    edited: editedField(),
    id: globalIdField("Person")
  }),
  interfaces: () => [nodeInterface]
});

export default PersonType;
