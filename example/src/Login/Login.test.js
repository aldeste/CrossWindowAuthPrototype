import React from "react";
import Login from "./Login";
import renderer from "react-test-renderer";
require("jasmine-check").install();

jest.mock("../Tags/Button", () => ({ className, children, ...props }) => (
  <button {...props}>{children}</button>
));
jest.mock("../Tags/Text", () => ({ className, children, ...props }) => (
  <p {...props}>{children}</p>
));
jest.mock("../Tags/Title", () => ({ className, children, ...props }) => (
  <h1 {...props}>{children}</h1>
));
jest.mock("../Tags/Form", () => ({ className, children, ...props }) => (
  <form {...props}>{children}</form>
));
jest.mock("../Tags/Label", () => ({ className, children, ...props }) => (
  <label {...props}>{children}</label>
));
jest.mock("../Tags/TextInput", () => ({ className, children, ...props }) => (
  <input {...props}>{children}</input>
));
jest.mock("../Tags/View", () => ({ className, children, ...props }) => (
  <div {...props}>{children}</div>
));

describe("Login react component", () => {
  it("Is a react component", () => {
    expect(typeof Login).toBe("function");
    expect(<Login />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  const arrayOfInputFields = tree =>
    tree.children
      .find(e => e.type === "form")
      .children.filter(e => e.type === "div")
      .reduce(
        (prev, next) => [
          ...prev,
          ...next.children.filter(e => e.type === "input")
        ],
        []
      );

  it("Enterint text in input changes value", () => {
    const component = renderer.create(<Login />);
    let tree = component.toJSON();

    expect(arrayOfInputFields(tree)).toMatchSnapshot();

    arrayOfInputFields(tree).forEach(e =>
      e.props.onChange({
        target: { name: e.props.name, value: "haschanged" }
      })
    );

    tree = component.toJSON();
    expect(arrayOfInputFields(tree)).toMatchSnapshot();
  });

  it("Makrs button as valid if both fields has 5 characters", () => {
    const component = renderer.create(<Login />);
    const getFields = tree => fieldToFind =>
      tree.children
        .find(e => e.type === "form")
        .children.filter(e => e.type === fieldToFind);
    let tree = component.toJSON();

    expect(getFields(tree)("button")[0].props.disabled).toBe(true);

    arrayOfInputFields(tree).forEach(e =>
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
      const tree = component.toJSON();

      arrayOfInputFields(tree)[0].props.onChange({
        target: {
          name: arrayOfInputFields(tree)[0].props.name,
          value: randomString
        }
      });

      const changedTree = component.toJSON();

      expect(typeof arrayOfInputFields(changedTree)[0].props.value).toBe(
        "string"
      );
    }
  );

  check.it("Removes whitespaces fom input", gen.string, randomString => {
    const component = renderer.create(<Login />);
    const tree = component.toJSON();

    arrayOfInputFields(tree)[0].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[0].props.name,
        value: randomString
      }
    });

    const secondTree = component.toJSON();

    expect(arrayOfInputFields(secondTree)[0].props.value).not.toContain(" ");
  });
});
