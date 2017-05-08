import generateMockData from "./generateMockData";
import chalk from "chalk";

const mockFunctionCreate = jest.fn();

jest.mock("./models", () => ({
  Planet: {
    hasMany: () => jest.fn()
  },
  Person: {
    hasMany: () => jest.fn(),
    create: () => mockFunctionCreate(),
    count: () => new Promise(resolve => resolve(2))
  }
}));

describe("generateMockData", () => {
  console.log = v => v;

  it("Doesn't generates mock data if forced is false", async () => {
    await generateMockData(false);
    expect(mockFunctionCreate).not.toHaveBeenCalled();
  });

  it("Generates mock data if forced is true", async () => {
    await generateMockData(true);
    expect(mockFunctionCreate).toHaveBeenCalled();
  });

  it("Console logs friendly message if all fields are inserted", async () => {
    expect(await generateMockData(true)).toBe(
      chalk.green.bold("All fields and connections are inserted")
    );
  });

  it("Console logs friendly message if all fields already were inserted", async () => {
    expect(await generateMockData(false)).toBe(
      chalk.yellow.bold("Fields already in database, have fun")
    );
  });
});
