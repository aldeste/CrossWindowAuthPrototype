const mockFunctionFileLoaded = jest.fn();

jest.mock("./modules", () => ({
  Planet: {
    hasMany: () => jest.fn()
  },
  Person: {
    hasMany: () => jest.fn(),
    create: () => jest.fn(),
    count: () => new Promise(resolve => resolve(2))
  }
}));

jest.mock("./databaseConnection", () => ({
  sync: () => {
    mockFunctionFileLoaded("databaseConnection.sync");
    return {
      then: () => jest.fn()
    };
  }
}));

const { default: connection, Person, Planet } = require("./");

describe("Modules are defined", () => {
  Promise.all(
    [Person, Planet].map(module =>
      it("Returns module " + module, () => expect(module).toBeDefined())
    )
  );
});

describe("Connection goes through settup", () => {
  it("Passes connection", () => expect(connection).toBeDefined());
});

describe("Connection is synched", () => {
  it("Passes connection", () =>
    expect(mockFunctionFileLoaded).toHaveBeenCalledWith(
      "databaseConnection.sync"
    ));
});
