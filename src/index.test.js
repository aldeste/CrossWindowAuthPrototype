require("./");

// We don't need to run each file,
// we just check that it's included
jest.mock("./server/main", () => null);
jest.mock("babel-register", () => null);
jest.mock("dotenv", () => ({ config: () => null }));

describe("index file", () => {
  it("includes all setup dependencies", done => done());
});
