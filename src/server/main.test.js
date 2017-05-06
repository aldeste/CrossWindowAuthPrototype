const supertest = require("supertest");
const server = require("./main").default;

global.console.log = () => jest.fn();

afterEach(() => {
  server.close();
});

describe("Express server starts server", () => {
  it("gives a response when accessing '/'", async () => {
    const response = await supertest(server).get("/");
    expect(response.status).not.toBe(200);
  });
});

describe("Accessing /", () => {
  it("yields response", async () => {
    const response = await supertest(server).get("/");
    expect(response.header.location).toBe("/graphql");
  });
});

describe("Accessing /graphql", () => {
  it("yields faliure without parameters", async () => {
    const response = await supertest(server).get("/graphql");
    expect(response.status).toBe(400);
  });
});

describe("Accessing /login", () => {
  it("returns a valid response", async () => {
    const response = await supertest(server).post("/login");
    expect(response.status).toBe(200);
  });
});

describe("Queries", () => {
  beforeEach(async () => {
    await require("../database").initializeDatabase();
  });

  it("queries with graphql", async () => {
    const response = await supertest(server).get(
      "/graphql?query={person(personId:4){id,name}}"
    );
    expect(response.text.data).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it("runs timer diagnostics", async () => {
    const response = await supertest(server).get(
      "/graphql?query={person(personId:4){id,name}}"
    );
    expect(JSON.parse(response.text).extensions.timeTaken).toBeDefined();
  });
});
