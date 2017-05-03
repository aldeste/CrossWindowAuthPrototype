import Button from "./Button";
import renderer from "react-test-renderer";
import React from "react";

// BUG: Theres a bug with jest-styled-components and styled-components 2.0.0-17, fix when updated.
// import { matcher, serializer } from "jest-styled-components";
//
// expect.addSnapshotSerializer(serializer);
// expect.extend(matcher);
//
// Once fixed, replace toMatchSnapshot() with toMatchStyledComponentsSnapshot()

describe("Button tag", () => {
  it("Should be defined", () => {
    expect(Button).toBeDefined();
  });

  it("Is a styled component", () => {
    expect(Button.name).toBe("StyledComponent");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Button />).toJSON();
    // BUG: jest-styled-component bug, remove when fixed
    tree.props.className = "";
    expect(tree).toMatchSnapshot();
  });

  it("Matches earlier configuration if alternative is true", () => {
    const tree = renderer.create(<Button alternative />).toJSON();
    // BUG: jest-styled-component bug, remove when fixed
    tree.props.className = "";
    expect(tree).toMatchSnapshot();
  });

  it("Matches earlier configuration if alt prop is true", () => {
    const tree = renderer.create(<Button disabled />).toJSON();
    // BUG: jest-styled-component bug, remove when fixed
    tree.props.className = "";
    expect(tree).toMatchSnapshot();
  });
});
