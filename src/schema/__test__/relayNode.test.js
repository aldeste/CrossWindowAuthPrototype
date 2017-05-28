import { idFetcher, typeResolver } from "../relayNode";
import schema from "../";
import { graphql } from "graphql";
import { createLoaders } from "../apiHelper";

beforeEach(async () => {
  console.log = jest.fn();
});

describe("idFetcher", () => {
  it("should default to null if unresolvable", () => {
    expect(idFetcher("IiI6IiI=")).toBeNull();
  });

  it("should return an object if parameters are valid ", async () => {
    await require("../../data").initializeDatabase();
    const result = await idFetcher("UGVyc29uOjQ=");
    expect(result.name).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.id).toBeDefined();
  });
});

describe("typeResolver", () => {
  it("should default to null if unresolvable", () => {
    expect(typeResolver({})).toBeNull();
  });

  it("should return correct type", () => {
    const obj = {
      GraphQLType: "Person"
    };
    expect(typeResolver(obj).name).toBe("Person");
  });
});

describe("nodeInterface", () => {
  beforeEach(async () => {
    await require("../../data").initializeDatabase();
  });

  const rootValue = {};
  const context = { loaders: createLoaders() };

  it("should return field with id", async () => {
    const query = `query Test {
      node(id:"UGVyc29uOjQ=") {
        ... on Person {
          name
        }
      }
    }`;

    const { data } = await graphql(schema, query, rootValue, context);
    expect(data).toMatchSnapshot();
  });

  it("should error if no id is suplied", async () => {
    const query = `query Test {
      node {
        ... on Person {
          name
        }
      }
    }`;

    const result = await graphql(schema, query, rootValue, context);

    expect(result.errors).toBeDefined();
  });

  it("should fail if called with false value", async () => {
    const query = `query Test {
      node(id:"e") {
        ... on Person {
          name
        }
      }
    }`;

    const { data } = await graphql(schema, query, rootValue, context);
    expect(data).toMatchSnapshot();
  });
});
