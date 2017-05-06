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
    const tree = renderer.create(<Login title="This is a title" />).toJSON();
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

  const getFields = tree => fieldToFind =>
    tree.children
      .find(e => e.type === "form")
      .children.filter(e => e.type === fieldToFind);

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
      let tree = component.toJSON();
      arrayOfInputFields(tree)[0].props.onChange({
        target: {
          name: arrayOfInputFields(tree)[0].props.name,
          value: randomString
        }
      });
      tree = component.toJSON();

      expect(typeof arrayOfInputFields(tree)[0].props.value).toBe("string");
    }
  );

  check.it("can't start with a whitespace", gen.string, randomString => {
    const component = renderer.create(<Login />);
    let tree = component.toJSON();
    arrayOfInputFields(tree)[0].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[0].props.name,
        value: randomString
      }
    });
    tree = component.toJSON();

    expect(arrayOfInputFields(tree)[0].props.value.match(/^\s+/)).toBeFalsy();
  });

  check.it("can't have double whitespace strings", gen.string, randomString => {
    const component = renderer.create(<Login />);
    let tree = component.toJSON();
    arrayOfInputFields(tree)[0].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[0].props.name,
        value: randomString
      }
    });
    tree = component.toJSON();
    expect(arrayOfInputFields(tree)[0].props.value).not.toContain("  ");
  });

  it("Returns an error if username is invalid", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            error: "This is an error"
          })
        })
      );

    const component = renderer.create(
      <Login title="This is a title" onLoginSubmit={jest.fn} />
    );
    let tree = component.toJSON();

    const inputFields = arrayOfInputFields(tree);

    inputFields[0].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[0].props.name,
        value: "This name doesn't exist in starwars"
      }
    });

    inputFields[1].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[1].props.name,
        value: "password"
      }
    });

    await tree.children
      .find(e => e.type === "form")
      .props.onSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Returns an error if password is invalid", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            error: "This is an error"
          })
        })
      );

    const component = renderer.create(
      <Login title="This is a title" onLoginSubmit={jest.fn} />
    );
    let tree = component.toJSON();

    const inputFields = arrayOfInputFields(tree);

    inputFields[0].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[0].props.name,
        value: "Yoda"
      }
    });

    inputFields[1].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[1].props.name,
        value: "Wrong password this is"
      }
    });

    await tree.children
      .find(e => e.type === "form")
      .props.onSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Signs in the user of password and username are correct", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            user: "This is an error"
          })
        })
      );

    const component = renderer.create(
      <Login title="This is a title" onLoginSubmit={jest.fn} />
    );
    let tree = component.toJSON();

    const inputFields = arrayOfInputFields(tree);

    inputFields[0].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[0].props.name,
        value: "Yoda"
      }
    });

    inputFields[1].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[1].props.name,
        value: "password"
      }
    });

    await tree.children
      .find(e => e.type === "form")
      .props.onSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Calls the onLoginSubmit callback on succsessfull loggin", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            user: "This isn't an error"
          })
        })
      );

    const onLoginSubmit = jest.fn();

    const component = renderer.create(
      <Login title="This is a title" onLoginSubmit={onLoginSubmit} />
    );
    let tree = component.toJSON();

    const inputFields = arrayOfInputFields(tree);
    inputFields[0].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[0].props.name,
        value: "Yoda"
      }
    });
    inputFields[1].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[1].props.name,
        value: "password"
      }
    });
    await tree.children
      .find(e => e.type === "form")
      .props.onSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });
    tree = component.toJSON();
    expect(onLoginSubmit).toHaveBeenCalled();
  });

  it("Doesn't calls the onLoginSubmit callback on error", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            error: "This is an error"
          })
        })
      );

    const onLoginSubmit = jest.fn();

    const component = renderer.create(
      <Login title="This is a title" onLoginSubmit={onLoginSubmit} />
    );
    let tree = component.toJSON();

    const inputFields = arrayOfInputFields(tree);
    inputFields[0].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[0].props.name,
        value: "Yoda"
      }
    });
    inputFields[1].props.onChange({
      target: {
        name: arrayOfInputFields(tree)[1].props.name,
        value: "password"
      }
    });
    await tree.children
      .find(e => e.type === "form")
      .props.onSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });
    tree = component.toJSON();
    expect(onLoginSubmit).not.toHaveBeenCalled();
  });
});
