import Text from "../Text";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("Text tag", () => {
  it("Should be defined", () => {
    expect(Text).toBeDefined();
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Text />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
