const supertest = require("supertest");
const server = require("./main").default;

jest.unmock("supertest").unmock("express");

beforeEach(() => {
  console.log = () => jest.fn();
});

afterEach(() => {
  server.close();
});

describe("Express server starts server", () => {
  it("gives a response when accessing '/'", async () => {
    const response = await supertest(server).get("/");
    expect(response.status).toBe(400);
  });
});

describe("Accessing /connect yields response", () => {
  it("recieves a response", async () => {
    const response = await supertest(server).get("/connect");
    expect(response.status).toBe(200);
  });
});

describe("Accessing /graphql yields response", () => {
  it("recieves a response", async () => {
    const response = await supertest(server).get("/graphql");
    expect(response.status).not.toBe(400);
  });
});
