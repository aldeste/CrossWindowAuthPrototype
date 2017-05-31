import TitleH3 from "../TitleH3";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("TitleH3 tag", () => {
  it("Should be defined", () => {
    expect(TitleH3).toBeDefined();
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<TitleH3 />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
