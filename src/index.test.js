// We don't need to run each file,
// we just check that it's included
jest.mock("./server/main", () => "main.js");
jest.mock("dotenv", () => ({ config: () => "dotenv.config" }));
jest.mock("babel-register", () => "babel-register");

describe("index file", () => {
  require("./");
  it("includes all setup dependencies", done => done());
});
