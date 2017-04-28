import React from "react";
import Login from "./Login";
import renderer from "react-test-renderer";
require("jasmine-check").install();

describe("Login react component", () => {
  it("Is a react component", () => {
    expect(typeof Login).toBe("function");
    expect(<Login />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Enterint text in input changes value", () => {
    const component = renderer.create(<Login />);
    const inputFields = tree =>
      tree.children
        .find(e => e.type === "form")
        .children.filter(e => e.type === "input");
    let tree = component.toJSON();

    expect(inputFields(tree)).toMatchSnapshot();

    inputFields(tree).forEach(e =>
      e.props.onChange({
        target: { name: e.props.name, value: "haschanged" }
      })
    );

    tree = component.toJSON();
    expect(inputFields(tree)).toMatchSnapshot();
  });

  it("Makrs button as valid if both fields has 5 characters", () => {
    const component = renderer.create(<Login />);
    const getFields = tree => fieldToFind =>
      tree.children
        .find(e => e.type === "form")
        .children.filter(e => e.type === fieldToFind);
    let tree = component.toJSON();

    expect(getFields(tree)("button")[0].props.disabled).toBe(true);

    getFields(tree)("input").forEach(e =>
      e.props.onChange({
        target: { name: e.props.name, value: "5 characters atleast" }
      })
    );

    tree = component.toJSON();
    expect(getFields(tree)("button")[0].props.disabled).toBe(false);
  });

  check.it(
    "Accepts string values in input fields",
    gen.string,
    randomString => {
      const component = renderer.create(<Login />);
      const inputFields = tree =>
        tree.children
          .find(e => e.type === "form")
          .children.find(e => e.type === "input");

      const tree = component.toJSON();

      inputFields(tree).props.onChange({
        target: { name: inputFields(tree).props.name, value: randomString }
      });

      const changedTree = component.toJSON();

      expect(typeof inputFields(changedTree).props.value).toBe("string");
    }
  );

  check.it("Removes whitespaces fom input", gen.string, randomString => {
    const component = renderer.create(<Login />);
    const inputFields = tree =>
      tree.children
        .find(e => e.type === "form")
        .children.find(e => e.type === "input");
    const tree = component.toJSON();

    inputFields(tree).props.onChange({
      target: { name: inputFields(tree).props.name, value: randomString }
    });

    const secondTree = component.toJSON();

    expect(inputFields(secondTree).props.value).not.toContain(" ");
  });
});
