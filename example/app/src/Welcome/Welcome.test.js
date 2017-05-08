import React from "react";
import Welcome from "./Welcome";
import ReactShallowRenderer from "react-test-renderer/shallow";
const renderer = new ReactShallowRenderer();

const mockClickFunction = jest.fn();

describe("Welcome react component", () => {
  const tree = renderer.render(
    <Welcome
      title="This is title"
      username="This is username"
      handleLogOut={e => mockClickFunction()}
    />
  );

  it("Is a react component", () => {
    expect(typeof Welcome).toBe("function");
    expect(<Welcome />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    expect(tree).toMatchSnapshot();
  });

  it("has a button", () => {
    expect(
      tree.props.children.find(el => el.type.target === "button")
    ).toBeTruthy();
  });

  it("has a title to identify which welcome screen we're in", () => {
    expect(
      tree.props.children.find(el => el.type.target === "h1")
    ).toBeTruthy();
  });

  it("has a text to identify which user is signed in", () => {
    expect(tree.props.children.find(el => el.type.target === "p")).toBeTruthy();
  });

  it("has an onClick function in the button", () => {
    tree.props.children.find(el => el.type.target === "button").props.onClick();
    expect(mockClickFunction).toHaveBeenCalled();
  });
});
