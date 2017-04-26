import React from "react";
import Login from "./Login";
import ReactShallowRenderer from "react-test-renderer/shallow";
const renderer = new ReactShallowRenderer();

describe("Login react component", () => {
  const tree = renderer.render(<Login />);
  it("Is a react component", () => {
    expect(typeof Login).toBe("function");
    expect(tree.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    expect(tree).toMatchSnapshot();
  });
});
