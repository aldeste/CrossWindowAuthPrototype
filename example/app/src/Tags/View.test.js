import View from "./View";
import renderer from "react-test-renderer";
import React from "react";
// BUG: Theres a bug with jest-styled-components and styled-components 2.0.0-17, fix when updated.
// import { matcher, serializer } from "jest-styled-components";
//
// expect.addSnapshotSerializer(serializer);
// expect.extend(matcher);
//
// Once fixed, replace toMatchSnapshot() with toMatchStyledComponentsSnapshot()

describe("View tag", () => {
  it("Should be defined", () => {
    expect(View).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(View.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<View />).toJSON();
    tree.props.className = "";
    expect(tree).toMatchSnapshot();
  });
});
