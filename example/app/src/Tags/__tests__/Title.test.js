import Title from "../Title";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("Title tag", () => {
  it("Should be defined", () => {
    expect(Title).toBeDefined();
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Title />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
