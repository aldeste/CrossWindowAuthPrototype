jest.mock("react-dom", () => ({ render: () => jest.fn() }));
const React = require("react");

describe("Root", () => {
  global.document = {
    getElementById: () => ({
      on: () => ({})
    })
  };
  require("./Root.prod");
  it("initiates", done => done());
});
