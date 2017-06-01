import React from "react";
import Welcome from "../Welcome";
import renderer from "react-test-renderer";

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
  View: ({ className, children, ...props }) => <div {...props}>{children}</div>
}));

const mockClickFunction = jest.fn();

const sleep = ms =>
  new Promise(res => {
    setTimeout(res, ms);
  });

describe("Welcome react component", () => {
  global.fetch = () =>
    new Promise(resolve =>
      resolve({
        json: () => ({
          data: {
            viewer: {
              name: "Yoda",
              birthYear: "896BBY",
              eyeColor: "brown",
              gender: "male",
              height: 66,
              mass: 17,
              homeworld: {
                name: "unknown",
                diameter: 0,
                residentConnection: {
                  edges: [
                    {
                      node: {
                        name: "Yoda"
                      }
                    },
                    {
                      node: {
                        name: "IG-88"
                      }
                    },
                    {
                      node: {
                        name: "Arvel Crynyd"
                      }
                    },
                    {
                      node: {
                        name: "Qui-Gon Jinn"
                      }
                    },
                    {
                      node: {
                        name: "R4-P17"
                      }
                    },
                    {
                      node: {
                        name: "Finn"
                      }
                    },
                    {
                      node: {
                        name: "Rey"
                      }
                    },
                    {
                      node: {
                        name: "Poe Dameron"
                      }
                    },
                    {
                      node: {
                        name: "BB8"
                      }
                    },
                    {
                      node: {
                        name: "Captain Phasma"
                      }
                    }
                  ]
                }
              }
            }
          },
          extensions: {
            timeTaken: "0s 39.838016ms"
          }
        })
      })
    );

  const component = renderer.create(
    <Welcome
      title="This is title"
      username="This is username"
      onLogoutSubmit={e => mockClickFunction()}
    />
  );

  const tree = component.toJSON();

  it("Is a react component", () => {
    expect(typeof Welcome).toBe("function");
    expect(<Welcome />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Matches earlier configuration", async () => {
    const component = renderer.create(
      <Welcome
        title="This is title"
        username="This is username"
        onLogoutSubmit={e => mockClickFunction()}
      />
    );
    await sleep(1);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has a button", () => {
    expect(tree.children.find(el => el.type === "button")).toBeTruthy();
  });

  it("has a title to identify which welcome screen we're in", () => {
    expect(tree.children.find(el => el.type === "h1")).toBeTruthy();
  });

  it("has a text to identify which user is signed in", () => {
    expect(tree.children.find(el => el.type === "p")).toBeTruthy();
  });

  it("has an onClick function in the button", () => {
    tree.children.find(el => el.type === "button").props.onClick();
    expect(mockClickFunction).toHaveBeenCalled();
  });
});
