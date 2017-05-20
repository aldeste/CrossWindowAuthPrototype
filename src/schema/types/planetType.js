/* @flow */
import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import { globalIdField } from "graphql-relay";
import { createdField, editedField } from "../commonFields";
import { nodeInterface } from "../relayNode";
import { connectionFromType } from "../connections";

// import FilmType from "./film";
import PersonType from "./personType";

const PlanetType = new GraphQLObjectType({
  name: "Planet",
  description: `A large mass, planet or planetoid in the Star Wars Universe, at the time of 0 ABY.`,
  fields: () => ({
    name: {
      type: GraphQLString,
      description: "The name of this planet.",
      resolve: planet => planet.name
    },
    diameter: {
      type: GraphQLInt,
      description: "The diameter of this planet in kilometers.",
      resolve: planet => planet.diameter
    },
    rotationPeriod: {
      type: GraphQLInt,
      resolve: planet => planet.rotation_period,
      description: `The number of standard hours it takes for this planet to complete a single rotation on its axis.`
    },
    orbitalPeriod: {
      type: GraphQLInt,
      resolve: planet => planet.orbital_period,
      description: `The number of standard days it takes for this planet to complete a single orbit of its local star.`
    },
    gravity: {
      type: GraphQLString,
      description: `A number denoting the gravity of this planet, where "1" is normal or 1 standard G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.`,
      resolve: planet => planet.gravity
    },
    population: {
      type: GraphQLInt,
      description: "The average population of sentient beings inhabiting this planet.",
      resolve: planet => planet.population
    },
    climates: {
      type: new GraphQLList(GraphQLString),
      resolve: planet => {
        return planet.climates && planet.climates.split(",").map(s => s.trim());
      },
      description: "The climates of this planet."
    },
    terrains: {
      type: new GraphQLList(GraphQLString),
      resolve: planet => {
        return planet.terrains && planet.terrains.split(",").map(s => s.trim());
      },
      description: "The terrains of this planet."
    },
    surfaceWater: {
      type: GraphQLFloat,
      resolve: planet => planet.surface_water,
      description: `The percentage of the planet surface that is naturally occuring water or bodies of water.`
    },
    residentConnection: {
      ...connectionFromType("PlanetResidents", PersonType, "residents"),
      description: "People from this planet"
    },
    // filmConnection: connectionFromUrls("PlanetFilms", "films", FilmType),
    created: createdField(),
    edited: editedField(),
    id: globalIdField("planets")
  }),
  interfaces: () => [nodeInterface]
});
export default PlanetType;
