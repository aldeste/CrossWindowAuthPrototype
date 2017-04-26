import React from "react";
import Input from "./Input";
import ReactShallowRenderer from "react-test-renderer/shallow";
const renderer = new ReactShallowRenderer();

describe("Input react component", () => {
  const tree = renderer.render(<Input />);
  it("Is a react component", () => {
    expect(typeof Input).toBe("function");
    expect(tree.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    expect(tree).toMatchSnapshot();
  });
});
