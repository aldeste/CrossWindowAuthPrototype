import Form from "./Form";
import renderer from "react-test-renderer";
import React from "react";
// BUG: Theres a bug with jest-styled-components and styled-components 2.0.0-17, fix when updated.
// import { matcher, serializer } from "jest-styled-components";
//
// expect.addSnapshotSerializer(serializer);
// expect.extend(matcher);
//
// Once fixed, replace toMatchSnapshot() with toMatchStyledComponentsSnapshot()

describe("Form tag", () => {
  it("Should be defined", () => {
    expect(Form).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(Form.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Form />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Horizontal matches earlier configuration", () => {
    const tree = renderer.create(<Form horizontal />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
