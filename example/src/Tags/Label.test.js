import Label from "./Label";
import renderer from "react-test-renderer";
import React from "react";
// BUG: Theres a bug with jest-styled-components and styled-components 2.0.0-17, fix when updated.
// import { matcher, serializer } from "jest-styled-components";
//
// expect.addSnapshotSerializer(serializer);
// expect.extend(matcher);
//
// Once fixed, replace toMatchSnapshot() with toMatchStyledComponentsSnapshot()

describe("Label tag", () => {
  it("Should be defined", () => {
    expect(Label).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(Label.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Label />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
