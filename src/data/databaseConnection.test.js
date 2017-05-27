jest.mock("sequelize", () => jest.fn());
const sequelize = require("sequelize");
const configure = require("../../config/config");
const connection = require("./databaseConnection");

describe("databseConnections", () => {
  it("runs without problems", () => expect(connection).toBeDefined());
  it("contains a username", () =>
    expect(sequelize.mock.calls[0][1]).toBe(configure.DB_USER));
  it("contains a password", () =>
    expect(sequelize.mock.calls[0][2]).toBe(configure.DB_PASS));
  it("defines a current dialect", () =>
    expect(sequelize.mock.calls[0][3].dialect).toBe("sqlite"));
});
