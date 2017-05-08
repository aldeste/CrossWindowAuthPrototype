import React from "react";
import App from "./App";
import renderer from "react-test-renderer";

const addEventListener = jest.fn();

jest
  .mock("./Document/Title", () => ({ children }) => <title>{children}</title>)
  .mock("./Tags/Button", () => ({ className, children, ...props }) => (
    <button {...props}>{children}</button>
  ))
  .mock("./Tags/Text", () => ({ className, children, ...props }) => (
    <p {...props}>{children}</p>
  ))
  .mock("./Tags/Title", () => ({ className, children, ...props }) => (
    <h1 {...props}>{children}</h1>
  ))
  .mock("./Tags/Form", () => ({ className, children, ...props }) => (
    <form {...props}>{children}</form>
  ))
  .mock("./Tags/Label", () => ({ className, children, ...props }) => (
    <label {...props}>{children}</label>
  ))
  .mock("./Tags/TextInput", () => ({ className, children, ...props }) => (
    <input {...props}>{children}</input>
  ))
  .mock("./Tags/View", () => ({ className, children, ...props }) => (
    <div {...props}>{children}</div>
  ));

describe("Application start file", () => {
  global.window = {
    addEventListener: (type, callback, options) =>
      addEventListener(type, callback, options)
  };

  global.console.log = jest.fn();

  it("renders without crashing", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Renders the welcome screen on login", () => {
    const component = renderer.create(<App />);
    component.getInstance().handleLogin("StarWars")({ name: "Yoda" });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Removes the welcome screen on logout", () => {
    const component = renderer.create(<App />);
    component.getInstance().handleLogin("StarWars")({ name: "Yoda" });
    component.getInstance().handleLogOut("StarWars")();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Adds an eventlistener for messages on mount", () => {
    const component = renderer.create(<App />);
    expect(addEventListener).toHaveBeenCalledWith(
      "message",
      component.getInstance().receiveMessage,
      false
    );
  });

  it("Processes messages with correct origin and type", () => {
    const component = renderer.create(<App />);
    const message = component
      .getInstance()
      .receiveMessage({
        origin: "http://localhost:4000",
        data: { type: "AuthVerificationConnection", data: true }
      });
    expect(message).toBeTruthy();
  });

  it("Doesn't process on wrong origin", () => {
    const component = renderer.create(<App />);
    const message = component
      .getInstance()
      .receiveMessage({
        origin: "http://localhost:4",
        data: { type: "AuthVerificationConnection", data: true }
      });
    expect(message).toBeFalsy();
  });

  it("Doesn't process on wrong origin", () => {
    const component = renderer.create(<App />);
    const message = component
      .getInstance()
      .receiveMessage({
        origin: "http://localhost:4",
        data: { type: "NotCorrect", data: true }
      });
    expect(message).toBeFalsy();
  });
});
