// We don't need to run each file,
// we just check that it's included
const mockFunctionFileLoaded = jest.fn();
jest.mock("../server/main", () => mockFunctionFileLoaded("main"));
jest.mock("dotenv", () => {
  mockFunctionFileLoaded("dotenv");
  return {
    config: config =>
      mockFunctionFileLoaded(`dotenv.config({silent: ${config.silent}})`)
  };
});
jest.mock("babel-register", () => mockFunctionFileLoaded("babel-register"));
jest.mock("../data", () => ({
  initializeDatabase: () => mockFunctionFileLoaded("initializeDatabase()")
}));

describe("index file", () => {
  require("../");
  it("It runs without failing", done => done());

  it("Includes ../server/main", () =>
    expect(mockFunctionFileLoaded).toHaveBeenCalledWith("main"));

  it("Includes dotenv", () =>
    expect(mockFunctionFileLoaded).toHaveBeenCalledWith("dotenv"));

  it("Silently fails if dotenv isn't present", () =>
    expect(mockFunctionFileLoaded).toHaveBeenCalledWith(
      "dotenv.config({silent: true})"
    ));

  it("Includes babel-register", () =>
    expect(mockFunctionFileLoaded).toHaveBeenCalledWith("babel-register"));

  it("Initializes the database", () =>
    expect(mockFunctionFileLoaded).toHaveBeenCalledWith(
      "initializeDatabase()"
    ));
});
