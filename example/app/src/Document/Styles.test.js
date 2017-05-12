import setGlobalStyles from "./Styles";

describe("Styles", () => {
  it("Matches previous settings", () => {
    expect(setGlobalStyles.toString()).toMatchSnapshot();
  });
  it("Runs without crashing", () => {
    expect(() => setGlobalStyles()).not.toThrowError();
  });
  it("Returns void", () => {
    expect(setGlobalStyles()).toBeUndefined();
  });
});
