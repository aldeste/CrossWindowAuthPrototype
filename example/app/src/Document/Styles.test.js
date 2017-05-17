const mockFunctionInjectGlobal = jest.fn();
jest.mock("styled-components", () => {
  return {
    injectGlobal: args => mockFunctionInjectGlobal(args)
  };
});

describe("Styles", () => {
  const InjectGlobalStyles = require("./Styles").default;
  it("Matches previous settings", () => {
    InjectGlobalStyles();
    expect(mockFunctionInjectGlobal.mock.calls[0]).toMatchSnapshot();
  });
  it("Runs without crashing", () => {
    expect(() => InjectGlobalStyles()).not.toThrowError();
  });
  it("Returns void", () => {
    expect(InjectGlobalStyles()).toBeUndefined();
  });
});
