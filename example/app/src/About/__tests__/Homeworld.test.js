import React from "react";
import renderer from "react-test-renderer";
import Homeworld from "../Homeworld";

jest.mock("../../Tags/Tags");

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
  it("Renders correctly with residents", () => {
    expect(
      renderer
        .create(<Homeworld name={"Tatooine"} residents={residents} />)
        .toJSON()
    ).toMatchSnapshot();
  });
  it("Renders correctly with empty residents", () => {
    expect(
      renderer.create(<Homeworld name={"Tatooine"} residents={[]} />).toJSON()
    ).toMatchSnapshot();
  });
});
