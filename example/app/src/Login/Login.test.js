import React from "react";
import Login from "./Login";
import renderer from "react-test-renderer";
require("jasmine-check").install();

jest.mock("../Tags", () => ({
  Button: ({ className, children, ...props }) => (
    <button {...props}>{children}</button>
  ),
  Text: ({ className, children, ...props }) => <p {...props}>{children}</p>,
  Title: ({ className, children, ...props }) => <h1 {...props}>{children}</h1>,
  Form: ({ className, children, ...props }) => (
    <form {...props}>{children}</form>
  ),
  Label: ({ className, children, ...props }) => (
    <label {...props}>{children}</label>
  ),
  TextInput: ({ className, children, ...props }) => (
    <input {...props}>{children}</input>
  ),
  View: ({ className, children, ...props }) => <div {...props}>{children}</div>
}));

const PostWindowMessage = jest.fn();
global.window = { postMessage: msg => PostWindowMessage(msg) };
global.window.top = { postMessage: msg => PostWindowMessage(msg) };
global.document = { querySelector: el => ({}) };

describe("Login react component", () => {
  it("Is a react component", () => {
    expect(typeof Login).toBe("function");
    expect(<Login />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", () => {
    const tree = renderer
      .create(<Login title="This is a title" prefix="formName" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Enterint text in input changes value", () => {
    const component = renderer.create(<Login prefix="formName" />);
    ["username", "password"].forEach(name =>
      component
        .getInstance()
        .handleInputChange({ target: { name, value: "haschanged" } })
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Marks button as valid if both fields has 5 characters", () => {
    const component = renderer.create(<Login prefix="formName" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    ["username", "password"].forEach(name =>
      component
        .getInstance()
        .handleInputChange({ target: { name, value: "More than 5" } })
    );
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  check.it("Accepts string values in input fields", gen.string, value => {
    const component = renderer.create(<Login prefix="formName" />);
    const fields = ["username", "password"];

    fields.forEach(name =>
      component.getInstance().handleInputChange({ target: { name, value } })
    );
    fields.forEach(name =>
      expect(typeof component.getInstance().state[name]).toBe("string")
    );
  });

  check.it("can't start with a whitespace", gen.string, randomString => {
    const component = renderer.create(<Login prefix="formName" />);
    component
      .getInstance()
      .handleInputChange({ target: { name: "username", value: randomString } });
    expect(component.getInstance().state.username.match(/^\s+/)).toBeFalsy();
  });

  check.it("can't have double whitespace strings", gen.string, randomString => {
    const component = renderer.create(<Login prefix="formName" />);
    component
      .getInstance()
      .handleInputChange({ target: { name: "username", value: randomString } });
    expect(component.getInstance().state.username).not.toContain("  ");
  });

  it("Returns an error if username is invalid", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({ json: () => ({ error: "This is an error" }) })
      );

    const component = renderer.create(
      <Login title="This is a title" onLoginSubmit={jest.fn} />
    );

    let tree = component.toJSON();

    component.getInstance().handleInputChange({
      target: {
        name: "username",
        value: "This name doesn't exist in Star Wars"
      }
    });
    component
      .getInstance()
      .handleInputChange({ target: { name: "password", value: "password" } });
    await component
      .getInstance()
      .handleOnSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Returns an error if password is invalid", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({ json: () => ({ error: "This is an error" }) })
      );

    const component = renderer.create(
      <Login
        title="This is a title"
        prefix="formName"
        onLoginSubmit={jest.fn}
      />
    );
    component
      .getInstance()
      .handleInputChange({ target: { name: "username", value: "Yoda" } });
    component.getInstance().handleInputChange({
      target: { name: "password", value: "Wrong password this is" }
    });
    await component
      .getInstance()
      .handleOnSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });
    const tree = component.toJSON();

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
      <Login
        title="This is a title"
        prefix="formName"
        onLoginSubmit={jest.fn}
      />
    );
    component
      .getInstance()
      .handleInputChange({ target: { name: "username", value: "Yoda" } });
    component
      .getInstance()
      .handleInputChange({ target: { name: "password", value: "password" } });
    await component
      .getInstance()
      .handleOnSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });

    const tree = component.toJSON();
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
      <Login
        title="This is a title"
        prefix="formName"
        onLoginSubmit={onLoginSubmit}
      />
    );

    component
      .getInstance()
      .handleInputChange({ target: { name: "username", value: "Yoda" } });
    component
      .getInstance()
      .handleInputChange({ target: { name: "password", value: "password" } });
    await component
      .getInstance()
      .handleOnSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });
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
      <Login
        title="This is a title"
        prefix="formName"
        onLoginSubmit={onLoginSubmit}
      />
    );

    component
      .getInstance()
      .handleInputChange({ target: { name: "username", value: "Yoda" } });
    component.getInstance().handleInputChange({
      target: { name: "password", value: "Wrong password this is" }
    });
    await component
      .getInstance()
      .handleOnSubmit({ preventDefault: jest.fn, stopPropagation: jest.fn });
    expect(onLoginSubmit).not.toHaveBeenCalled();
  });
});
