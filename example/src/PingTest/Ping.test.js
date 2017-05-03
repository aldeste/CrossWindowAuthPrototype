import React from "react";
import Ping, { resolveToken } from "./Ping";
import renderer from "react-test-renderer";

jest.mock("../Document/Title", () => ({ children }) => (
  <title>{children}</title>
));
// Remove all class names from tags as they're auto generated,
// will cause tests to fail
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

describe("PingTest / Ping", () => {
  it("Matches previous setup", () => {
    const tree = renderer.create(<Ping />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Clicking button changes state", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({ json: () => ({ user: "foo bar", time: "foo bar" }) })
      );

    const component = renderer.create(<Ping token="foo bar" />);
    let tree = component.toJSON();
    await tree.children.find(e => e.type === "button").props.onClick();
    tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("Clicking button with no props changes nothing", async () => {
    const component = renderer.create(<Ping />);
    let tree = component.toJSON();
    await tree.children.find(e => e.type === "button").props.onClick();
    tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
