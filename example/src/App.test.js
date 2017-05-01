import React from "react";
import App from "./App";
import renderer from "react-test-renderer";

// Remove all class names from tags as they're auto generated,
// will cause tests to fail
jest.mock("./Tags/Button", () => ({ className, children, ...props }) => (
  <button {...props}>{children}</button>
));
jest.mock("./Tags/Text", () => ({ className, children, ...props }) => (
  <p {...props}>{children}</p>
));
jest.mock("./Tags/Title", () => ({ className, children, ...props }) => (
  <h1 {...props}>{children}</h1>
));
jest.mock("./Tags/Form", () => ({ className, children, ...props }) => (
  <form {...props}>{children}</form>
));
jest.mock("./Tags/Label", () => ({ className, children, ...props }) => (
  <label {...props}>{children}</label>
));
jest.mock("./Tags/TextInput", () => ({ className, children, ...props }) => (
  <input {...props}>{children}</input>
));
jest.mock("./Tags/View", () => ({ className, children, ...props }) => (
  <div {...props}>{children}</div>
));

it("renders without crashing", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
