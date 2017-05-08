import React from "react";
import App from "./App";
import renderer from "react-test-renderer";

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

it("renders without crashing", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("Updates satate to reflect login", () => {
  const component = renderer.create(<App />);
  component.getInstance().signIn("StarWars")({ name: "Yoda" });
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
