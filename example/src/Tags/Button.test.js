import Button from "./Button";
import renderer from "react-test-renderer";
import React from "react";
import { matcher, serializer } from "jest-styled-components";

expect.addSnapshotSerializer(serializer);
expect.extend(matcher);

describe("Button tag", () => {
  it("Should be defined", () => {
    expect(Button).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(Button.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Button />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });

  it("Matches earlier configuration if alt prop is true", () => {
    const tree = renderer.create(<Button alt />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
