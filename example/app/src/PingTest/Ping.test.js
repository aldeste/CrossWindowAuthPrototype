import React from "react";
import Ping from "./Ping";
import renderer from "react-test-renderer";

jest
  .mock("../Document/Title", () => ({ children }) => <title>{children}</title>)
  .mock("../Tags/Button", () => ({ className, children, ...props }) => (
    <button {...props}>{children}</button>
  ))
  .mock("../Tags/Text", () => ({ className, children, ...props }) => (
    <p {...props}>{children}</p>
  ))
  .mock("../Tags/Title", () => ({ className, children, ...props }) => (
    <h1 {...props}>{children}</h1>
  ))
  .mock("../Tags/Form", () => ({ className, children, ...props }) => (
    <form {...props}>{children}</form>
  ))
  .mock("../Tags/Label", () => ({ className, children, ...props }) => (
    <label {...props}>{children}</label>
  ))
  .mock("../Tags/TextInput", () => ({ className, children, ...props }) => (
    <input {...props}>{children}</input>
  ))
  .mock("../Tags/View", () => ({ className, children, ...props }) => (
    <div {...props}>{children}</div>
  ));

describe("PingTest / Ping", () => {
  it("Matches previous setup", () => {
    const tree = renderer.create(<Ping />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Is a react component", () => {
    expect(typeof Ping).toBe("function");
    expect(<Ping />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Clicking button changes state", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            data: { person: { name: "foo bar" } },
            extensions: { timeTaken: "foo bar" }
          })
        })
      );

    const component = renderer.create(<Ping token="foo bar" />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Clicking button with no props changes nothing", async () => {
    const component = renderer.create(<Ping />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
