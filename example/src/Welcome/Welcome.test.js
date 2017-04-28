import React from "react";
import Welcome from "./Welcome";
import ReactShallowRenderer from "react-test-renderer/shallow";
const renderer = new ReactShallowRenderer();

describe("Welcome react component", () => {
  const tree = renderer.render(<Welcome />);
  it("Is a react component", () => {
    expect(typeof Welcome).toBe("function");
    expect(tree.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    expect(tree).toMatchSnapshot();
  });
});
