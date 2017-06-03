import TitleH2 from "../TitleH2";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("TitleH2 tag", () => {
  it("Should be defined", () => {
    expect(TitleH2).toBeDefined();
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<TitleH2 />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
