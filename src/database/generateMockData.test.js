import generateMockData from "./generateMockData";

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

describe("generateMockData", () => {
  console.log = () => ({});
  it("Generates mock data if forced is true", async () =>
    await generateMockData(true));
  it("Doesn't generates mock data if forced is false", async () =>
    await generateMockData(false));
});
