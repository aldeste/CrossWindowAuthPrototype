import Label from "./Label";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("Label tag", () => {
  it("Should be defined", () => {
    expect(Label).toBeDefined();
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Label />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Matches earlier configuration if required is passed", () => {
    const tree = renderer.create(<Label required />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
