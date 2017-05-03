import React from "react";
import LoginButton from "./LoginButton";
import ReactShallowRenderer from "react-test-renderer/shallow";
const renderer = new ReactShallowRenderer();
require("jasmine-check").install();

describe("LoginButton react component", () => {
  it("Is a react component", () => {
    expect(typeof LoginButton).toBe("function");
    expect(<LoginButton />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.render(<LoginButton value="Form isn't disabled" />);
    expect(tree.props).toMatchSnapshot();
  });

  it("Matches earlier configuration if disabled is activated", () => {
    const tree = renderer.render(
      <LoginButton disabled disabledValue="Form is disabled" />
    );
    expect(tree.props).toMatchSnapshot();
  });

  check.it("Accepts any string as value", gen.string, randomString => {
    const tree = renderer.render(<LoginButton value={randomString} />);
    expect(tree.props.children).toBe(randomString);
  });
});
