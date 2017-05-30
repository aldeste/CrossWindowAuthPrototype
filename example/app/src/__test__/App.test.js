import React from "react";
import App from "../App";
import renderer from "react-test-renderer";

jest
  .mock("../Document/Title", () => ({ children }) => <title>{children}</title>)
  .mock("../Tags", () => ({
    Button: ({ className, children, ...props }) => (
      <button {...props}>{children}</button>
    ),
    Text: ({ className, children, ...props }) => <p {...props}>{children}</p>,
    Title: ({ className, children, ...props }) => (
      <h1 {...props}>{children}</h1>
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
    View: ({ className, children, ...props }) => (
      <div {...props}>{children}</div>
    ),
    Wrapper: ({ className, children, ...props }) => (
      <div {...props}>{children}</div>
    ),
    Iframe: ({ className, children, ...props }) => (
      <div {...props}>{children}</div>
    )
  }));

const sleep = ms =>
  new Promise(res => {
    setTimeout(res, ms);
  });

const addEventListener = jest.fn();
const PostWindowMessage = jest.fn();
const postMessage = { postMessage: msg => PostWindowMessage(msg) };

beforeAll(() => {
  global.document = {};
  global.console.log = jest.fn();
  global.window = postMessage;
  global.window.addEventListener = (type, callback, options) =>
    addEventListener(type, callback, options);
  global.window.top = postMessage;
  global.document = {};
  global.document.querySelector = () => ({
    contentWindow: postMessage
  });
});

describe("Application loads asynchronously", () => {
  it("starts of empty", () => {
    const component = renderer.create(<App />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("loads in the welcome screen asynchronously", () => {
    const component = renderer.create(<App />);
    component.getInstance().handleLogin("StarWars")({ name: "Yoda" });
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("Application start file", () => {
  it("renders without crashing", async () => {
    const component = renderer.create(<App />);
    await sleep(1);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("Renders the welcome screen on login", async () => {
    const component = renderer.create(<App />);
    component.getInstance().handleLogin("StarWars")({ name: "Yoda" });
    await sleep(1);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Removes the welcome screen on logout", () => {
    const component = renderer.create(<App />);
    component.getInstance().handleLogin("StarWars")({ name: "Yoda" });
    component.getInstance().handleLogOut("StarWars")();
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Adds an eventlistener for messages on mount", () => {
    const component = renderer.create(<App />);
    expect(addEventListener).toHaveBeenCalledWith(
      "message",
      component.getInstance().receiveMessage,
      false
    );
  });

  it("Processes messages with correct origin and type", () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            personId: "1",
            name: "Luke Skywalker",
            token: "cGVvcGxlOjE=",
            id: "cGVvcGxlOjE="
          })
        })
      );

    const component = renderer.create(<App />);
    const message = component.getInstance().receiveMessage({
      origin: "http://localhost:4000",
      source: global.window,
      data: { type: "AuthVerificationConnection", data: "cGVvcGxlOjQ=" }
    });
    expect(message).toBeTruthy();
  });

  it("Sends callback to fetch users if data is correct", () => {
    const fetchCall = jest.fn();
    global.fetch = () => {
      fetchCall();
      return new Promise(resolve =>
        resolve({
          json: () => ({
            data: {
              person: {
                name: "Darth Vader",
                token: "cGVvcGxlOjQ=",
                personId: "4",
                id: "UGVyc29uOjQ="
              }
            }
          })
        })
      );
    };

    const component = renderer.create(<App />);
    component.getInstance().receiveMessage({
      origin: "http://localhost:4000",
      source: global.window,
      data: {
        type: "AuthVerificationConnection",
        data: {
          name: "Darth Vader",
          token: "cGVvcGxlOjQ=",
          personId: "4",
          id: "cGVvcGxlOjQ="
        }
      }
    });
    expect(fetchCall).toHaveBeenCalled();
  });

  it("Doesn't process on wrong origin", () => {
    const component = renderer.create(<App />);
    const message = component.getInstance().receiveMessage({
      origin: "http://localhost:4",
      source: "not same window",
      data: { type: "AuthVerificationConnection", data: true }
    });
    expect(message).toBeFalsy();
  });

  it("Doesn't process on wrong origin", () => {
    const component = renderer.create(<App />);
    const message = component.getInstance().receiveMessage({
      origin: "http://localhost:4",
      source: "Not same window",
      data: { type: "NotCorrect", data: true }
    });
    expect(message).toBeFalsy();
  });

  it("Posts a message event to window", async () => {
    const component = renderer.create(<App />);
    await component.getInstance().postMessage({ name: "Yoda" });
    expect(PostWindowMessage).toHaveBeenCalledWith({
      data: { name: "Yoda" },
      type: "AuthVerificationConnection"
    });
  });

  it("Logs in users by token", () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            data: {
              person: {
                name: "Darth Vader",
                token: "cGVvcGxlOjQ=",
                personId: "4",
                id: "UGVyc29uOjQ="
              }
            }
          })
        })
      );
    const component = renderer.create(<App />);
    component.getInstance().connectUser("cGVvcGxlOjQ=");
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("Fails silentlry if token is invalid", () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            error: "There be dragons"
          })
        })
      );
    const component = renderer.create(<App />);
    expect(() =>
      component.getInstance().connectUser("Token That Fails")
    ).not.toThrowError();
  });
});
