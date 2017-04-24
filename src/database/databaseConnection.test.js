const connection = require("./databaseConnection").default;

describe("databseConnections", () => {
  it("runs without problems", () => expect(connection).not.toBeUndefined());
});
