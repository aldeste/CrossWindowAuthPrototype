import Iframe from "../Iframe";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("Iframe tag", () => {
  it("Should be defined", () => {
    expect(Iframe).toBeDefined();
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Iframe />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
