import Wrapper from "../Wrapper";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("Wrapper tag", () => {
  it("Should be defined", () => {
    expect(Wrapper).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(Wrapper.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Wrapper />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
