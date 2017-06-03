import generateMockData from "../generateMockData";
import chalk from "chalk";

const mockFunctionCreate = jest.fn();
const consoleLogMockFunction = jest.fn();

jest.mock("progress");
jest.mock("../models", () => ({
  Planet: {
    hasMany: () => jest.fn(),
    belongsToMany: () => jest.fn(),
    create: () => jest.fn(),
    findOne: () => new Promise(resolve => resolve({ addResidents: jest.fn() })),
    addScope: () => jest.fn()
  },
  Person: {
    hasMany: () => jest.fn(),
    create: () => mockFunctionCreate(),
    count: () => new Promise(resolve => resolve(2)),
    findOne: () => new Promise(resolve => resolve({ setHomeworld: jest.fn() })),
    belongsTo: () => jest.fn(),
    findAll: () => jest.fn(),
    addScope: () => jest.fn()
  }
}));

describe("generateMockData", () => {
  console.log = v => consoleLogMockFunction(v);

  it("Doesn't generates mock data if forced is false", async () => {
    jest.clearAllMocks();
    await generateMockData(false);
    expect(mockFunctionCreate).not.toHaveBeenCalled();
  });

  it("Generates mock data if forced is true", async () => {
    jest.clearAllMocks();
    await generateMockData(true);
    expect(mockFunctionCreate).toHaveBeenCalled();
  });

  it("Console logs friendly message if all fields are inserted", async () => {
    jest.clearAllMocks();
    await generateMockData(true);
    expect(consoleLogMockFunction).toHaveBeenCalledWith(
      chalk.green.bold(
        "All fields and connections have been inserted in database"
      )
    );
  });

  it("Console logs friendly message if all fields already were inserted", async () => {
    jest.clearAllMocks();
    await generateMockData(false);
    expect(consoleLogMockFunction).toHaveBeenCalledWith(
      chalk.yellow.bold("Fields already in database, have fun")
    );
  });

  it("Defaults to not forcing database entry", async () => {
    jest.clearAllMocks();
    await generateMockData();
    expect(consoleLogMockFunction).toHaveBeenCalledWith(
      chalk.yellow.bold("Fields already in database, have fun")
    );
  });

  it("Console logs friendly message if all fields already were inserted and progress was requested", async () => {
    jest.clearAllMocks();
    await generateMockData(false, true);
    expect(consoleLogMockFunction).toHaveBeenCalledWith(
      chalk.yellow.bold("Fields already in database, have fun")
    );
  });

  it("Runs progress bar without crashing", async () => {
    jest.clearAllMocks();
    await generateMockData(true, true);
    expect(consoleLogMockFunction).toHaveBeenCalledWith(
      chalk.green.bold(
        "All fields and connections have been inserted in database"
      )
    );
  });
});
