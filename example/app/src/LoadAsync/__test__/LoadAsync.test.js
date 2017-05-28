import LoadAsync from "../LoadAsync";
import React from "react";
import renderer from "react-test-renderer";

const sleep = ms =>
  new Promise(res => {
    setTimeout(res, ms);
  });

describe("LoadAsync", () => {
  it("starts out blank", () => {
    const Prepper = LoadAsync({
      loader: () => import("../nothing")
    });
    const component = renderer.create(<Prepper />);
    expect(component.toJSON()).toBe(null);
  });

  it("errors if loading fails", async () => {
    const Prepper = LoadAsync({
      loader: () => import("../nothing")
    });
    const component = renderer.create(<Prepper />);
    await sleep(201);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders `loading` if loading is slow", async () => {
    const Prepper = LoadAsync({
      loader: () => new Promise(res => {})
    });
    const component = renderer.create(<Prepper />);
    await sleep(201);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders loading element", async () => {
    const Prepper = LoadAsync({
      loader: () => import("../../Welcome/Welcome")
    });
    const component = renderer.create(<Prepper />);
    await sleep(201);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
