import React from "react";
import MainApp from "../App";
import IframeApp from "../IframeContent/App";
import renderer from "react-test-renderer";

jest
  .mock("../Document/Title")
  .mock("../Tags/Tags")
  .mock("../Iframe/HeightNotifierHOC");

const sleep = ms =>
  new Promise(res => {
    setTimeout(res, ms);
  });

const addEventListener = jest.fn();
const PostWindowMessage = jest.fn();
const postMessage = { postMessage: msg => PostWindowMessage(msg) };

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

beforeAll(() => {
  global.document = {};
  global.console.log = jest.fn();
  global.window = postMessage;
  global.window.addEventListener = (type, callback, options) =>
    addEventListener(type, callback, options);
  global.window.top = postMessage;
  global.window.parent = postMessage;
  global.document = {};
  global.document.querySelector = () => ({
    contentWindow: postMessage
  });
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
});

[MainApp, IframeApp].forEach(App => {
  describe(App.name + " loads asynchronously", () => {
    it("starts of empty", () => {
      const component = renderer.create(<App />);
      expect(component.toJSON()).toMatchSnapshot();
    });

    it("loads in the welcome screen asynchronously", async () => {
      const component = renderer.create(<App />);
      sleep(1);
      (await App.name) === "App"
        ? component.getInstance().handleLogin("StarWars")({ name: "Yoda" })
        : component.getInstance().handleLogin({ name: "Yoda" });
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe(App.name + " start file", () => {
    it("renders without crashing", async () => {
      const component = renderer.create(<App />);
      await sleep(1);
      expect(component.toJSON()).toMatchSnapshot();
    });

    it("Renders the welcome screen on login", async () => {
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

      const component = renderer.create(<App />);
      (await App.name) === "App"
        ? component.getInstance().handleLogin("StarWars")({ name: "Yoda" })
        : component.getInstance().handleLogin({ name: "Yoda" });
      await sleep(1);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("Removes the welcome screen on logout", async () => {
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

      const component = renderer.create(<App />);
      (await App.name) === "App"
        ? component.getInstance().handleLogin("StarWars")({ name: "Yoda" })
        : component.getInstance().handleLogin({ name: "Yoda" });
      await sleep(1);
      (await App.name) === "App"
        ? component.getInstance().handleLogOut("StarWars")()
        : component.getInstance().handleLogOut();
      await sleep(1);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("Adds an eventlistener for messages on mount", () => {
      expect(addEventListener).toHaveBeenCalled();
    });

    it("Processes messages with correct origin and type", () => {
      const component = renderer.create(<App />);
      const message = component.getInstance().receiveMessage({
        origin: "http://localhost:4000",
        source: global.window,
        data: { type: "AuthVerificationConnection", data: "cGVvcGxlOjQ=" }
      });
      expect(message).toBeTruthy();
    });

    it("Doesn't process postMessage on wrong origin", async () => {
      const component = renderer.create(<App />);
      const message = await component.getInstance().receiveMessage(3)({
        origin: "http://localhost:4",
        source: "Not same window",
        data: { type: "NotCorrect", data: true }
      });
      expect(message).toBeFalsy();
    });

    it("Doesn't process postMessage on wrong source and origin combination", async () => {
      const component = renderer.create(<App />);
      const message = await component.getInstance().receiveMessage(3)({
        origin: "http://localhost:4050",
        source: global.document.querySelector.contentWindow,
        data: { type: "NotCorrect", data: true }
      });
      expect(message).toBeFalsy();
    });

    it("Doens't send verified user if user is incorrect", async () => {
      jest.clearAllMocks();
      global.fetch = () =>
        new Promise(resolve =>
          resolve({
            json: () => ({
              data: {
                viewer: {
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
      await component.getInstance().receiveMessage(3)({
        origin: "http://localhost:4000",
        source: global.window,
        data: {
          type: "AuthVerificationConnectionVerify",
          data: {
            personId: "1",
            name: "Luke Skywalker",
            token: "cGVvcGxlOjE=",
            id: "cGVvcGxlOjE=",
            key: 50
          }
        }
      });

      expect(PostWindowMessage).not.toHaveBeenCalled();
    });

    it("Sends verified user if user is correct", async () => {
      jest.clearAllMocks();
      global.fetch = () =>
        new Promise(resolve =>
          resolve({
            json: () => ({
              data: {
                viewer: {
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
      await component.getInstance().receiveMessage(3)({
        origin: "http://localhost:4000",
        source: global.window,
        data: {
          type: "AuthVerificationConnectionVerify",
          data: {
            name: "Darth Vader",
            token: "cGVvcGxlOjQ=",
            personId: "4",
            id: "cGVvcGxlOjQ=",
            key: 50
          }
        }
      });

      expect(PostWindowMessage).toHaveBeenCalledWith({
        data: {
          id: "UGVyc29uOjQ=",
          key: 50,
          name: "Darth Vader",
          personId: "4",
          token: "cGVvcGxlOjQ="
        },
        type: "AuthVerificationConnectionVerified"
      });
    });

    it("Sends callback to fetch users if data is correct", () => {
      jest.clearAllMocks();
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
      component.getInstance().receiveMessage(3)({
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

      expect(PostWindowMessage).toHaveBeenCalledWith({
        data: {
          id: "cGVvcGxlOjQ=",
          key: 3,
          name: "Darth Vader",
          personId: "4",
          token: "cGVvcGxlOjQ="
        },
        type: "AuthVerificationConnectionVerify"
      });
    });

    it("Processes verified user if verified user is recieved", async () => {
      jest.clearAllMocks();
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
      await component.getInstance().receiveMessage(3)({
        origin: "http://localhost:4000",
        source: global.window,
        data: {
          type: "AuthVerificationConnectionVerified",
          data: {
            name: "Darth Vader",
            token: "cGVvcGxlOjQ=",
            personId: "4",
            id: "cGVvcGxlOjQ=",
            key: 3
          }
        }
      });

      expect(fetchCall).toHaveBeenCalled();
    });

    it("Posts a message event to window", async () => {
      const component = renderer.create(<App />);
      await component.getInstance().postMessage({ name: "Yoda" });
      expect(PostWindowMessage).toHaveBeenCalledWith({
        data: { name: "Yoda" },
        type: "AuthVerificationConnection"
      });
    });

    it("Getts the authorized user using getCurrentlyAuthorizedUserInfo", async () => {
      global.fetch = () =>
        new Promise(resolve =>
          resolve({
            json: () => ({
              data: {
                viewer: {
                  id: "cGVvcGxlOjE5",
                  name: "Yoda"
                }
              }
            })
          })
        );
      const component = renderer.create(<App />);
      const user = await component
        .getInstance()
        .getCurrentlyAuthorizedUserInfo();

      expect(user).toMatchObject({
        id: "cGVvcGxlOjE5",
        name: "Yoda"
      });
    });

    it("Returns null if calling getCurrentlyAuthorizedUserInfo without valid results", async () => {
      global.fetch = () =>
        new Promise(resolve =>
          resolve({
            json: () => ({
              data: {
                viewer: null
              }
            })
          })
        );
      const component = renderer.create(<App />);
      const user = await component
        .getInstance()
        .getCurrentlyAuthorizedUserInfo();

      expect(user).toBeNull();
    });

    it("Fails silentlry if invalid token is provided to connectUser", () => {
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

    it("Logs in users by token sent to method connectUser", async () => {
      global.fetch = () =>
        new Promise(resolve =>
          resolve({
            json: () => ({
              data: PersonInfo,
              name: "Darth Vader",
              token: "cGVvcGxlOjQ=",
              personId: "4",
              id: "UGVyc29uOjQ="
            })
          })
        );
      const component = renderer.create(<App />);
      await component.getInstance().connectUser("cGVvcGxlOjQ=");
      await sleep(1);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
