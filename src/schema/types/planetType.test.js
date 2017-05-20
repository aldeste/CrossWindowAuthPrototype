import schema from "../";
import planetType from "./planetType";
import { graphql } from "graphql";
import { createLoaders } from "../apiHelper";

beforeEach(async () => {
  console.log = jest.fn();
  await require("../../database").initializeDatabase();
});

describe("planetType is a GraphQL type", () => {
  const rootValue = {};
  const context = { loaders: createLoaders() };

  it("Has the name Planet", () => {
    expect(planetType.name).toBe("Planet");
  });

  it("should return on every field", async () => {
    const query = `query Test {
      person(personId: 1) {
        homeworld {
          name
          diameter
          rotationPeriod
          orbitalPeriod
          gravity
          population
          climates
          terrains
          surfaceWater
          residentConnection {
            edges {
              node {
                name
              }
            }
          }
          id
        }
      }
    }`;

    const { data } = await graphql(schema, query, rootValue, context);
    expect(data).toMatchSnapshot();
  });
});
