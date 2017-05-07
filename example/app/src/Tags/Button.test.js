import Button from "./Button";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("Button tag", () => {
  it("Should be defined", () => {
    expect(Button).toBeDefined();
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Button />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Matches earlier configuration if alternative is true", () => {
    const tree = renderer.create(<Button alternative />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Matches earlier configuration if alt prop is true", () => {
    const tree = renderer.create(<Button disabled />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
