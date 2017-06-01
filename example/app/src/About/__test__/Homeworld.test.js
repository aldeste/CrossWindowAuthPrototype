import React from "react";
import renderer from "react-test-renderer";
import Homeworld from "../Homeworld";

jest.mock("../../Tags", () => ({
  Button: ({ className, children, ...props }) => (
    <button {...props}>{children}</button>
  ),
  Text: ({ className, children, ...props }) => <p {...props}>{children}</p>,
  Title: ({ className, children, ...props }) => <h1 {...props}>{children}</h1>,
  TitleH2: ({ className, children, ...props }) => (
    <h2 {...props}>{children}</h2>
  ),
  TitleH3: ({ className, children, ...props }) => (
    <h3 {...props}>{children}</h3>
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
  View: ({ className, children, ...props }) => <div {...props}>{children}</div>,
  Wrapper: ({ className, children, ...props }) => (
    <div {...props}>{children}</div>
  ),
  Iframe: ({ className, children, ...props }) => (
    <div {...props}>{children}</div>
  )
}));

const residents = [
  "Luke Skywalker",
  "C-3PO",
  "Darth Vader",
  "Owen Lars",
  "Beru Whitesun lars",
  "R5-D4",
  "Biggs Darklighter",
  "Anakin Skywalker",
  "Shmi Skywalker",
  "Cliegg Lars"
];

describe("About component", () => {
  it("Renders correctly", () => {
    expect(
      renderer
        .create(<Homeworld name={"Tatooine"} residents={residents} />)
        .toJSON()
    ).toMatchSnapshot();
  });
});
