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
  sync: () => ({
    then: () => jest.fn()
  })
}));

const { default: connection, Person, Planet, generateMockData } = require("./");

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

// describe("generateMockData", () => {
//   console.log = () => ({});
//   it("Generates mock data if forced is true", async () =>
//     await generateMockData(true));
//   it("Goesnt generates mock data if forced is false", async () =>
//     await generateMockData(false));
// });
