import TextInput from "./TextInput";
import renderer from "react-test-renderer";
import React from "react";
import "jest-styled-components";

describe("TextInput tag", () => {
  it("Should be defined", () => {
    expect(TextInput).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(TextInput.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<TextInput />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
