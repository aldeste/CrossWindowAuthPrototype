jest.mock("react-dom", () => ({ render: () => jest.fn() }));
jest.mock("./App", () => jest.fn());
jest.mock("./Document/Styles", () => jest.fn());
const React = require("react");

describe("Root.dev", () => {
  global.document = {
    getElementById: () => ({
      on: () => ({})
    }),
    querySelectorAll: () => jest.fn(),
    createElement: () => jest.fn()
  };

  const { default: rootFile } = require("./Root.dev");
  const toRender = () => <p>This is a test</p>;

  it("Initiates", () => expect(rootFile(toRender)).toMatchSnapshot());
});
