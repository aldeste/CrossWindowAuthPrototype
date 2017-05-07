import View from "./View";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("View tag", () => {
  it("Should be defined", () => {
    expect(View).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(View.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<View />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
