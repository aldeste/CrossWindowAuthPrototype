import renderer from "react-test-renderer";
import React from "React";
import StyleVariables from "./StyleVariables";

test("StyleVariables renders correctly", () => {
  const tree = renderer.create(<StyleVariables />).toJSON();
  expect(tree).toMatchSnapshot();
});
