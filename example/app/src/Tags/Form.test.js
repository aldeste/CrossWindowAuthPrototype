import Form from "./Form";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("Form tag", () => {
  it("Should be defined", () => {
    expect(Form).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(Form.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Form />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Horizontal matches earlier configuration", () => {
    const tree = renderer.create(<Form horizontal />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
