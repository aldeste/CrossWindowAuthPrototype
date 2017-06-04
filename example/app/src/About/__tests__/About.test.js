import React from "react";
import renderer from "react-test-renderer";
import About from "../About";

jest.mock("../../Tags/Tags");

const PersonInfo = {
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

const sleep = ms =>
  new Promise(res => {
    setTimeout(res, ms);
  });

describe("About component", () => {
  global.fetch = () =>
    new Promise(resolve =>
      resolve({
        json: () => ({
          data: {
            viewer: PersonInfo,
            person: PersonInfo
          }
        })
      })
    );
  it("Starts att null", () => {
    expect(renderer.create(<About />).toJSON()).toBe(null);
  });

  it("Renders correctly on fetch", async () => {
    const component = renderer.create(<About />);
    await sleep(1);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
