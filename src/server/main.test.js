const supertest = require("supertest");
const server = require("./main").default;

jest.unmock("supertest").unmock("express");

beforeEach(() => {
  console.log = () => ({});
});

afterEach(() => {
  server.close();
});

describe("Express server starts server", () => {
  it("gives a response when accessing '/'", async () => {
    const response = await supertest(server).get("/");
    expect(response.status).toBe(400);
  });

  it("redirects '/graphql' to '/'", async () => {
    const response = await supertest(server).get("/graphql");
    expect(response.header.location).toBe("/");
  });
});
