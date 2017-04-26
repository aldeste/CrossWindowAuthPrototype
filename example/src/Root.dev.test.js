jest.mock("react-dom", () => ({ render: () => jest.fn() }));
const React = require("react");

describe("Root", () => {
  global.document = {
    getElementById: () => ({
      on: () => ({})
    })
  };

  const { default: rootFile } = require("./Root.dev");
  const toRender = () => <p>This is a test</p>;

  it("Initiates", () => expect(rootFile(toRender)).toMatchSnapshot());
});
