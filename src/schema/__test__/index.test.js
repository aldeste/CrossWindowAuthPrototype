const { createLoaders } = require("../../schema/apiHelper");
const { graphql } = require("graphql");
const schema = require("../").default;
const server = require("../../server/main").default;

const consoleLogMock = jest.fn();
global.console.log = msg => consoleLogMock(msg);

afterEach(() => {
  server.close();
});

describe("Schema", () => {
  it("exports a GraphQL schema", () => expect(schema).toBeDefined());
});

describe("Queries", () => {
  beforeEach(async () => {
    await require("../../data").initializeDatabase();
  });

  it("runs person scehma by personId", async () => {
    const response = await graphql(
      schema,
      `{ person(personId: "4") { name } }`,
      {},
      { loaders: createLoaders() }
    );
    expect(response.data.person.name).toBeDefined();
  });

  it("runs person scehma by id", async () => {
    const person = await graphql(
      schema,
      `{ person(personId: "4") { id } }`,
      {},
      { loaders: createLoaders() }
    );
    const response = await graphql(
      schema,
      `{ person(id: "${person.data.person.id}") { name } }`,
      {},
      { loaders: createLoaders() }
    );
    expect(response.data.person.name).toBeDefined();
  });

  it("fails to run person scehma without arguments", async () => {
    const response = await graphql(
      schema,
      `{ person { name } }`,
      {},
      { loaders: createLoaders() }
    );
    expect(response.data.person).toBe(null);
  });

  it("fails to run person scehma if id argument is invalid", async () => {
    const response = await graphql(
      schema,
      `{ person(id: "invalid string should fail") { name } }`,
      {},
      { loaders: createLoaders() }
    );
    expect(response.data.person).toBe(null);
  });

  it("fails to run person scehma if personId argument is invalid", async () => {
    const response = await graphql(
      schema,
      `{ person(personId: "false string should fail") { name } }`,
      {},
      { loaders: createLoaders() }
    );
    expect(response.data.person).toBe(null);
  });

  it("runs viewer schema if viewer is defined", async () => {
    const viewer = await graphql(
      schema,
      `{ person(personId: "4") { name id personId } }`,
      {},
      { loaders: createLoaders() }
    );
    const response = await graphql(
      schema,
      `{ viewer { name id personId } }`,
      {},
      { loaders: createLoaders(), viewer: viewer.data.person }
    );
    expect(viewer.data.person).toMatchObject(response.data.viewer);
  });

  it("fails to run viewer if viewer isn't defined", async () => {
    const response = await graphql(
      schema,
      `{ viewer { name id personId } }`,
      {},
      { loaders: createLoaders(), viewer: {} }
    );
    expect(response.data.viewer).toBe(null);
  });
});
