import View from "./View";
import renderer from "react-test-renderer";
import React from "react";
import { matcher, serializer } from "jest-styled-components";

expect.addSnapshotSerializer(serializer);
expect.extend(matcher);

describe("View tag", () => {
  it("Should be defined", () => {
    expect(View).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(View.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<View />).toJSON();
    expect(tree).toMatchStyledComponentsSnapshot();
  });
});
