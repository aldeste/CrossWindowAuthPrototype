const mockFunctionFileLoaded = jest.fn();
jest.mock("./Root.dev", () => {
  mockFunctionFileLoaded();
  return "./Root.dev";
});

const index = require("./");

describe("Example index.js", () => {
  it("runs without crashing", done => done());
  it("includes Root", () => expect(mockFunctionFileLoaded).toHaveBeenCalled());
  it("Exports Root", () => expect(index).toBe("./Root.dev"));
});
