const supertest = require("supertest");
const main = require("../main");
const { default: server, loggingMiddleware } = main;

const consoleLogMock = jest.fn();
global.console.log = msg => consoleLogMock(msg);

beforeAll(async () => {
  await require("../../data").initializeDatabase();
});

const supertestServer = supertest(server);

afterAll(() => {
  server.close();
});

describe("Express server starts server", () => {
  it("gives a response when accessing '/'", async () => {
    const response = await supertestServer.get("/");
    expect(response.status).not.toBe(200);
  });
});

describe("Accessing /", () => {
  it("yields response", async () => {
    const response = await supertestServer.get("/");
    expect(response.header.location).toBe("/graphql");
  });
});

describe("Accessing /graphql", () => {
  it("yields faliure without parameters", async () => {
    const response = await supertestServer.get("/graphql");
    expect(response.status).toBe(400);
  });
});

describe("Accessing /connect", () => {
  it("yields faliure without parameters", async () => {
    const response = await supertestServer.post("/connect");
    expect(response.status).toBe(404);
    expect(response.text).toBe("");
  });

  it("yields null response with invalid token", async () => {
    const response = await supertestServer
      .post("/connect")
      .send({ data: { key: "BOTTLE_OF_WINE", token: 3 } });
    expect(response.status).toBe(200);
    expect(response.text).toBe("");
  });

  it("yields good response with valid token", async () => {
    const response = await supertestServer
      .post("/connect")
      .send({ data: { key: "BOTTLE_OF_WINE", token: "cGVvcGxlOjE5" } });
    expect(response.status).toBe(200);
    expect(response.text).toMatchSnapshot();
  });
});

describe("Accessing /login", () => {
  it("returns an invalid response without parameters", async () => {
    const response = await supertestServer.post("/login");
    expect(response.status).toBe(404);
  });

  it("returns an invalid response if it doesn't have the correct parameters", async () => {
    const response = await supertestServer
      .post("/login")
      .send({ mayTheForce: "be with you" });
    expect(response.status).toBe(404);
  });

  it("returns a user with corect parameters", async () => {
    const response = await supertestServer
      .post("/login")
      .send({ name: "Yoda", password: "password" });
    expect(JSON.parse(response.text)).toMatchSnapshot();
  });

  it("returns an error if it fails due to wrong password", async () => {
    const response = await supertestServer
      .post("/login")
      .send({ name: "Yoda", password: "Wrong Password" });
    expect(JSON.parse(response.text).error).toBeDefined();
  });

  it("returns an error if it fails due to unexisting username", async () => {
    const response = await supertestServer.post("/login").send({
      name: "Someone WHo Isn't In Star Wars",
      password: "Wrong Password"
    });
    expect(JSON.parse(response.text).error).toBeDefined();
  });
});

describe("Cookies", () => {
  it("Returns a HttpOnly signed cookie", async () => {
    const response = await supertestServer
      .post("/login")
      .send({ name: "Yoda", password: "password" });
    expect(response.header["set-cookie"][0]).toBeDefined();
    expect(response.header["set-cookie"][0]).toContain("HttpOnly");
  });

  it("Reads cookies and creates updated if cookie is older than offset", async () => {
    const _Date = Date;
    const LATER_DATE = new Date((new Date().getFullYear() + 1).toString());
    const serverInstance = await supertest.agent(server);

    await serverInstance
      .post("/login")
      .send({ name: "Yoda", password: "password" });

    global.Date = jest.fn(() => LATER_DATE);
    global.Date.UTC = _Date.UTC;
    global.Date.parse = _Date.parse;
    global.Date.now = _Date.now;
    const gqlResponse = await serverInstance.post(
      "/graphql?query={person(personId:4){id,name}}"
    );

    global.Date = _Date;
    expect(gqlResponse.req._headers.cookie).toBeDefined();
    expect(gqlResponse.header["set-cookie"][0]).toBeDefined();
  });

  it("Reads cookies and doesn't make new if cookie is fresh", async () => {
    const serverInstance = await supertest.agent(server);
    await serverInstance
      .post("/login")
      .send({ name: "Yoda", password: "password" });
    const gqlResponse = await serverInstance.post(
      "/graphql?query={person(personId:4){id,name}}"
    );

    expect(gqlResponse.req._headers.cookie).toBeDefined();
    expect(gqlResponse.header["set-cookie"]).toBeUndefined();
  });
});

describe("Queries", () => {
  it("queries with graphql", async () => {
    const response = await supertestServer.get(
      "/graphql?query={person(personId:4){id,name}}"
    );
    expect(response.text.data).toMatchSnapshot();
    expect(response.status).toBe(200);
  });

  it("runs timer diagnostics", async () => {
    const response = await supertestServer.get(
      "/graphql?query={person(personId:4){id,name}}"
    );
    expect(JSON.parse(response.text).extensions.timeTaken).toBeDefined();
  });
});

describe("loggingMiddleware", () => {
  it("Doesn't print cookies if cookies are not present", () => {
    consoleLogMock.mockReset();
    loggingMiddleware({}, null, jest.fn);
    expect(consoleLogMock).not.toHaveBeenCalledWith("Current signed cookies");
  });

  it("prints cookies if cookies are present", () => {
    consoleLogMock.mockReset();
    const signedCookies = {
      signedCookies: { thisiscookie: JSON.stringify({ I: "testing" }) }
    };
    loggingMiddleware(signedCookies, null, jest.fn);

    expect(consoleLogMock).toHaveBeenCalledWith("Current signed cookies");
  });
});
