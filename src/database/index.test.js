const mockFunctionFileLoaded = jest.fn();

jest.mock("./models", () => ({
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

const {
  default: connection,
  Person,
  Planet,
  initializeDatabase
} = require("./");

describe("Models are defined", () => {
  Promise.all(
    [Person, Planet].map(model =>
      it("Returns model " + model, () => expect(model).toBeDefined())
    )
  );
});

describe("Connection goes through settup", () => {
  initializeDatabase();
  it("Passes connection", () => expect(connection).toBeDefined());
});

describe("Connection is synched", () => {
  it("Passes connection", () =>
    expect(mockFunctionFileLoaded).toHaveBeenCalledWith(
      "databaseConnection.sync"
    ));
});
