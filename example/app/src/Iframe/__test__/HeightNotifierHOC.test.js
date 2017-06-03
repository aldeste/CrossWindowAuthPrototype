import HeightNotifierHOC from "../HeightNotifierHOC";
import React from "react";
import renderer from "react-test-renderer";

const postMessage = jest.fn();
const clearIntervalSpy = jest.fn();

describe("Iframe component wrapper", () => {
  beforeAll(() => {
    global.window = jest.fn();
    global.document = jest.fn();
    global.document.documentElement = jest.fn();
    global.document.documentElement.scrollHeight = jest.fn();
    global.window.top = jest.fn();
    global.window.top.postMessage = postMessage;
    global.window.setInterval = jest.fn();
    global.window.addEventListener = jest.fn();
    global.clearInterval = clearIntervalSpy;
  });

  it("Returnes wrapped component", () => {
    const WrappedDiv = HeightNotifierHOC(() =>
      <div>This is just a component to be passed through a HOC</div>
    );
    expect(renderer.create(<WrappedDiv />).toJSON()).toMatchSnapshot();
  });

  it("Updates height on message", () => {
    const WrappedDiv = HeightNotifierHOC(() =>
      <div>This is just a component to be passed through a HOC</div>
    );
    const tree = renderer.create(<WrappedDiv />);
    tree.getInstance().notifyHeight();

    expect(postMessage).toHaveBeenCalled();
  });

  it("Fails to post message silently if no document exists", () => {
    global.document = undefined;
    const WrappedDiv = HeightNotifierHOC(() =>
      <div>This is just a component to be passed through a HOC</div>
    );
    const tree = renderer.create(<WrappedDiv />);
    tree.getInstance().notifyHeight();

    expect(postMessage).toHaveBeenCalled();
  });

  it("Removes listener on unmount", () => {
    const WrappedDiv = HeightNotifierHOC(() =>
      <div>This is just a component to be passed through a HOC</div>
    );
    const tree = renderer.create(<WrappedDiv />);
    tree.getInstance().componentWIllUnount();

    expect(clearInterval).toHaveBeenCalled();
  });
});
