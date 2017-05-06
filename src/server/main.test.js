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
  beforeEach(async () => {
    await require("../database").initializeDatabase();
  });

  it("returns an invalid response without parameters", async () => {
    const response = await supertest(server).post("/login");
    expect(response.status).toBe(404);
  });

  it("returns an invalid response if it doesn't have the correct parameters", async () => {
    const response = await supertest(server)
      .post("/login")
      .send({ mayTheForce: "be with you" });
    expect(response.status).toBe(404);
  });

  it("returns a user with corect parameters", async () => {
    const response = await supertest(server)
      .post("/login")
      .send({ name: "Yoda", password: "password" });
    expect(JSON.parse(response.text)).toMatchSnapshot();
  });

  it("returns an error if it fails due to wrong password", async () => {
    const response = await supertest(server)
      .post("/login")
      .send({ name: "Yoda", password: "Wrong Password" });
    expect(JSON.parse(response.text).error).toBeDefined();
  });

  it("returns an error if it fails due to unexisting username", async () => {
    const response = await supertest(server)
      .post("/login")
      .send({
        name: "Someone WHo Isn't In Star Wars",
        password: "Wrong Password"
      });
    expect(JSON.parse(response.text).error).toBeDefined();
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
