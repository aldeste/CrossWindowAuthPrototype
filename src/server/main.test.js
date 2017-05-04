const supertest = require("supertest");
const server = require("./main").default;

// jest.unmock("supertest").unmock("express");

beforeEach(() => {
  console.log = () => jest.fn();
});

afterEach(() => {
  server.close();
});

describe("Express server starts server", () => {
  it("gives a response when accessing '/'", async () => {
    const response = await supertest(server).get("/");
    expect(response.status).not.toBe(200);
  });
});

// describe("Accessing /connect yields response", () => {
//   it("recieves a response", async () => {
//     const response = await supertest(server).get("/connect");
//     expect(response.status).toBe(200);
//   });
// });

describe("Accessing /graphql", () => {
  it("yields response", async () => {
    const response = await supertest(server).get("/graphql");
    expect(response.header.location).toBe("/");
  });
});

describe("Queries", () => {
  beforeEach(async () => {
    await require("../database").initializeDatabase();
  });

  it("queries with graphql", async () => {
    const response = await supertest(server).get(
      "/?query={viewer(personId:4){id,name}}"
    );
    expect(response.text.data).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it("runs timer diagnostics", async () => {
    const response = await supertest(server).get(
      "/?query={viewer(personId:4){id,name}}"
    );
    expect(JSON.parse(response.text).extensions.timeTaken).toBeDefined();
  });
});
