import schema from "../";
import personType from "./personType";
import { graphql } from "graphql";
import { createLoaders } from "../apiHelper";

beforeEach(async () => {
  console.log = jest.fn();
  await require("../../database").initializeDatabase();
});

describe("personType is a GraphQL type", () => {
  const rootValue = {};
  const context = { loaders: createLoaders() };

  it("Has the name Person", () => {
    expect(personType.name).toBe("Person");
  });

  it("should return on every field", async () => {
    const query = `query Test {
      person(personId: 5) {
        name
        birthYear
        eyeColor
        gender
        hairColor
        height
        mass
        skinColor
        token
        id
        homeworld {
          id
          name
        }
      }
    }`;

    const { data } = await graphql(schema, query, rootValue, context);
    expect(data).toMatchSnapshot();
  });

  it("should return on every field with id", async () => {
    const query = `query Test {
      person(id: "cGVvcGxlOjU=") {
        name
        birthYear
        eyeColor
        gender
        hairColor
        height
        mass
        skinColor
        token
        id
        homeworld {
          id
          name
        }
      }
    }`;

    const { data } = await graphql(schema, query, rootValue, context);
    expect(data).toMatchSnapshot();
  });

  it("should return nothing if no argument is supplied", async () => {
    const query = `query Test {
      viewer {
        name
      }
    }`;

    const { data } = await graphql(schema, query, rootValue, context);

    expect(data.viewer).toBe(null);
  });

  it("should return nothing if id argument is invalid", async () => {
    const query = `query Test {
      viewer(id: "e") {
        name
      }
    }`;

    const result = await graphql(schema, query, rootValue, context);

    expect(result.errors).toBeDefined();
  });

  it("should return nothing if personId argument is invalid", async () => {
    const query = `query Test {
      viewer(personId: e) {
        name
      }
    }`;

    const result = await graphql(schema, query, rootValue, context);

    expect(result.errors).toBeDefined();
  });
});
