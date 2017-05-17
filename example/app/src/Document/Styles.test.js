// jest.mock("styled-components", () => ({
//   injectGlobal: () => jest.fn()
// }));

const mockFunctionInjectGlobal = jest.fn();
jest.mock("styled-components", () => {
  return {
    injectGlobal: args => mockFunctionInjectGlobal(args)
  };
});

describe("Styles", () => {
  const InjectGlobalStyles = require("./Styles").default;
  it("Matches previous settings", () => {
    // expect(setGlobalStyles.toString()).toMatchSnapshot();
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
