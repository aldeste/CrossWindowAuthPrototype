import React from "react";
import Ping from "../Ping";
import renderer from "react-test-renderer";

jest.mock("../../Document/Title").mock("../../Tags/Tags");

describe("PingTest / Ping", () => {
  beforeAll(() => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            data: { person: { name: "Yoda" } },
            extensions: { timeTaken: "Time string" }
          })
        })
      );
  });

  it("Matches previous setup", () => {
    const tree = renderer.create(<Ping />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Is a react component", () => {
    expect(typeof Ping).toBe("function");
    expect(<Ping />.$$typeof.toString()).toBe("Symbol(react.element)");
  });

  it("Fetches and updates state if button is clicked", async () => {
    const component = renderer.create(<Ping />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Prints out timeTaken", async () => {
    const component = renderer.create(<Ping />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(
      tree.children
        .filter(el => el.type === "p")
        .filter(el => el.children === "Time string")
    ).toBeDefined();
  });

  it("Prints out data", async () => {
    const component = renderer.create(<Ping />);
    await component.getInstance().handleClick();
    const tree = component.toJSON();
    expect(
      tree.children
        .filter(el => el.type === "p")
        .filter(el => el.children === "Yoda")
    ).toBeDefined();
  });

  it("Ussues callback on click", async () => {
    const callbackChecker = jest.fn();
    const component = renderer.create(<Ping callback={callbackChecker} />);
    await component.getInstance().handleClick();
    expect(callbackChecker).toHaveBeenCalled();
  });

  it("Resolves token", async () => {
    const callbackChecker = jest.fn();
    const component = renderer.create(<Ping callback={callbackChecker} />);
    const resolved = await component.getInstance().resolveToken("3");
    expect(resolved).toMatchObject({
      time: "Time string",
      user: { name: "Yoda" }
    });
  });
});

describe("No connectio in PingTest", () => {
  beforeAll(() => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            data: null,
            extensions: { timeTaken: "Time string" }
          })
        })
      );
  });
  it("Doesn't issue callback if token can't resolve on click", async () => {
    const callbackChecker = jest.fn();
    const component = renderer.create(<Ping callback={callbackChecker} />);
    await component.getInstance().handleClick();
    expect(callbackChecker).not.toHaveBeenCalled();
  });

  it("Returns null id token can't resolve", async () => {
    const callbackChecker = jest.fn();
    const component = renderer.create(<Ping callback={callbackChecker} />);
    const resolved = await component.getInstance().resolveToken("3");
    expect(resolved).toBeNull();
  });
});
