import React from "react";
import Ping from "../Ping";
import renderer from "react-test-renderer";

jest
  .mock("../../Document/Title", () => ({ children }) => (
    <title>{children}</title>
  ))
  .mock("../../Tags", () => ({
    Button: ({ className, children, ...props }) => (
      <button {...props}>{children}</button>
    ),
    Text: ({ className, children, ...props }) => <p {...props}>{children}</p>,
    Title: ({ className, children, ...props }) => (
      <h1 {...props}>{children}</h1>
    ),
    Form: ({ className, children, ...props }) => (
      <form {...props}>{children}</form>
    ),
    Label: ({ className, children, ...props }) => (
      <label {...props}>{children}</label>
    ),
    TextInput: ({ className, children, ...props }) => (
      <input {...props}>{children}</input>
    ),
    View: ({ className, children, ...props }) => (
      <div {...props}>{children}</div>
    )
  }));

describe("PingTest / Ping", () => {
  global.fetch = () =>
    new Promise(resolve =>
      resolve({
        json: () => ({
          data: { person: { name: "Yoda" } },
          extensions: { timeTaken: "Time string" }
        })
      })
    );

  it("Matches previous setup", () => {
    const tree = renderer.create(<Ping />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Is a react component", () => {
    expect(typeof Ping).toBe("function");
    expect(<Ping />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Fetches and updates state if button is clicked", async () => {
    const component = renderer.create(<Ping token="foo bar" />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Prints out timeTaken", async () => {
    const component = renderer.create(<Ping token="foo bar" />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(
      tree.children
        .filter(el => el.type === "p")
        .find(el => el.children[0] === "Time string")
    ).toBeDefined();
  });

  it("Prints out data", async () => {
    const component = renderer.create(<Ping token="foo bar" />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(
      tree.children
        .filter(el => el.type === "p")
        .find(el => el.children[0] === "Yoda")
    ).toBeDefined();
  });

  it("Changes nothing if there's no prop passed in", async () => {
    const component = renderer.create(<Ping />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Ussues callback on click", async () => {
    const callbackChecker = jest.fn();
    const component = renderer.create(<Ping callback={callbackChecker} />);
    await component.getInstance().handleClick();
    expect(callbackChecker).toHaveBeenCalled();
  });
});
