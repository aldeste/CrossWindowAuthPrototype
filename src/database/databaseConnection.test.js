const connection = require("./databaseConnection").default;

describe("databseConnections", () => {
  it("runs without problems", () => expect(connection).toBeDefined());
  it("contains a username", () =>
    expect(connection.config.username).toBeDefined());
  it("contains a password", () =>
    expect(connection.config.password).toBeDefined());
  it("defines a current dialect", () =>
    expect(connection.options.dialect).toBeDefined());
});
