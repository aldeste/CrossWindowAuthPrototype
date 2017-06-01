import React from "react";
import renderer from "react-test-renderer";
import ProfileInfo from "../ProfileInfo";

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

const viewer = {
  name: "Luke Skywalker",
  birthYear: "19BBY",
  eyeColor: "blue",
  hairColor: "blond",
  gender: "male",
  homeworld: {
    name: "Tatooine",
    residentConnection: {
      edges: [
        {
          node: {
            name: "Luke Skywalker"
          }
        },
        {
          node: {
            name: "C-3PO"
          }
        },
        {
          node: {
            name: "Darth Vader"
          }
        },
        {
          node: {
            name: "Owen Lars"
          }
        },
        {
          node: {
            name: "Beru Whitesun lars"
          }
        },
        {
          node: {
            name: "R5-D4"
          }
        },
        {
          node: {
            name: "Biggs Darklighter"
          }
        },
        {
          node: {
            name: "Anakin Skywalker"
          }
        },
        {
          node: {
            name: "Shmi Skywalker"
          }
        },
        {
          node: {
            name: "Cliegg Lars"
          }
        }
      ]
    }
  }
};

describe("About component", () => {
  it("Renders correctly", () => {
    expect(
      renderer.create(<ProfileInfo viewer={viewer} />).toJSON()
    ).toMatchSnapshot();
  });
});
