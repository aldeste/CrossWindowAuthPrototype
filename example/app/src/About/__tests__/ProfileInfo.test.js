import React from "react";
import renderer from "react-test-renderer";
import ProfileInfo from "../ProfileInfo";

jest.mock("../../Tags/Tags");

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
  it("Renders correctly with all parameters", () => {
    expect(
      renderer.create(<ProfileInfo viewer={viewer} />).toJSON()
    ).toMatchSnapshot();
  });

  it("Renders correctly with no gender", () => {
    expect(
      renderer
        .create(
          <ProfileInfo viewer={Object.assign({}, viewer, { gender: "none" })} />
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});
