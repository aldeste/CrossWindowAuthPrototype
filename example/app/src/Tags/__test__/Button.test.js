import Button from "../Button";
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

  it("Matches earlier configuration if disabled prop is true", () => {
    const tree = renderer.create(<Button disabled />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Matches earlier configuration if outlined is true", () => {
    const tree = renderer.create(<Button outlined />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Matches earlier configuration if alternative and outlined prop is true", () => {
    const tree = renderer.create(<Button alternative outlined />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Matches earlier configuration if alternative and disabled prop is true", () => {
    const tree = renderer.create(<Button alternative disabled />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Matches earlier configuration if alternative, disabled and outlined prop is true", () => {
    const tree = renderer
      .create(<Button alternative disabled outlined />)
      .toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
