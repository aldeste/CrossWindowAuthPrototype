import TextInput from "./TextInput";
import renderer from "react-test-renderer";
import React from "react";
import { matcher, serializer } from "jest-styled-components";

expect.addSnapshotSerializer(serializer);
expect.extend(matcher);

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
