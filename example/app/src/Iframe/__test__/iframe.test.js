import Iframe from "../Iframe";
import React from "react";
import renderer from "react-test-renderer";

jest.mock("../../Tags");

describe("Iframe component wrapper", () => {
  beforeAll(() => {
    global.window = jest.fn();
    global.window.addEventListener = jest.fn();
  });

  it("Exports", () => expect(renderer.create(<Iframe />)).toBeDefined());

  it("Renders as previously", () =>
    expect(renderer.create(<Iframe />).toJSON()).toMatchSnapshot());

  it("Updates height on message", () => {
    const tree = renderer.create(<Iframe />);

    expect(tree.toJSON().props.height).toBe("500px");
    tree.getInstance().heightManager({
      data: {
        type: "heightUpdate",
        data: {
          height: 1000
        }
      }
    });

    expect(tree.toJSON().props.height).toBe("1000px");
  });

  it("Ignores irelevant updates", () => {
    const tree = renderer.create(<Iframe />);

    expect(tree.toJSON().props.height).toBe("500px");
    tree.getInstance().heightManager({
      data: {
        type: "NOT_heightUpdate",
        data: {
          height: 1000
        }
      }
    });

    expect(tree.toJSON().props.height).toBe("500px");
  });
});
