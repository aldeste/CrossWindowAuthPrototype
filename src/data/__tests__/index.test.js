const mockFunctionFileLoaded = jest.fn();

jest.mock("../models");
jest.mock("../databaseConnection", () => ({
  sync: () => {
    mockFunctionFileLoaded("databaseConnection.sync");
    return {
      then: () => jest.fn()
    };
  }
}));

const {
  default: connection,
  Person,
  Planet,
  initializeDatabase
} = require("../");

describe("Models are defined", () => {
  [
    { name: "Person", model: Person },
    { name: "Planet", model: Planet }
  ].map(model =>
    it(`Returns model ${model.name}`, () => expect(model.model).toBeDefined())
  );
});

describe("Database connection", () => {
  initializeDatabase();
  it("Connection is defined", () => expect(connection).toBeDefined());
});

describe("Connection is synched", () => {
  it("Passes connection", () =>
    expect(mockFunctionFileLoaded).toHaveBeenCalledWith(
      "databaseConnection.sync"
    ));
});
