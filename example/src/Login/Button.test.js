import React from "react";
import Button from "./Button";
import ReactShallowRenderer from "react-test-renderer/shallow";
const renderer = new ReactShallowRenderer();

describe("Button react component", () => {
  const tree = renderer.render(<Button />);
  it("Is a react component", () => {
    expect(typeof Button).toBe("function");
    expect(tree.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    expect(tree).toMatchSnapshot();
  });
});
