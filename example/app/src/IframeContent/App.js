// @flow
import React from "react";
import { Map } from "immutable";
import { Wrapper } from "../Tags";
import LoadAsync from "../LoadAsync/LoadAsync";
import { type State, type MessageEventWithOptions } from "../App";

// We load components in asynchronously using React Loadable.
// That way we minimize initial paint time of files and perceved load time.
const Welcome = LoadAsync({
  loader: () => import("../Welcome/Welcome")
});
const Login = LoadAsync({ loader: () => import("../Login/Login") });

class App extends React.Component<*, State, *> {
  state = {
    signedIn: Map()
  };

  connectUser = async (data: Object): Object => {
    const response: Object = await fetch("/api/connect", {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept-Encoding": "gzip",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({ data })
    }).then(response => response.json());

    if (!response.error && response.name && response.token) {
      this.setState(() => ({
        signedIn: this.state.signedIn.set("StarWars", Map(response))
      }));
    }

    return response;
  };

  // This is another implementation similar to the one found in the outer window.
  // Here, since there's only one login system on this website, we eliminate any
  // requests comming from the same window.
  receiveMessage = (key: number): Function => {
    // This is the function the event handler uses
    return async (event: MessageEventWithOptions): Promise<boolean> => {
      const { origin, data, source } = event;

      // Verefy that the request is from a good origin and source
      if (
        origin === "http://localhost:4000" &&
        source &&
        source === window.parent
      ) {
        // Step one, send a request to message source asking
        // which user is logged in
        if (data.type === "AuthVerificationConnection") {
          const { data: initialUserData }: Object = data;
          source.postMessage(
            {
              type: "AuthVerificationConnectionVerify",
              data: { ...initialUserData, key }
            },
            "http://localhost:4000"
          );
        }

        // Step two occurs on the other side, it returns the key recieved
        // from the request ( this keeps track that this is a response )
        // and checks which user is signed in and verefied by checking
        // with the backend for a verefied token.
        // This token could be sessions, cookies and whatever you want.
        // I'm using signed cookies.
        if (data.type === "AuthVerificationConnectionVerify") {
          const CurrentlyAuthorizedUserInfo = await this.getCurrentlyAuthorizedUserInfo();
          if (
            CurrentlyAuthorizedUserInfo &&
            CurrentlyAuthorizedUserInfo.token === data.data.token
          ) {
            source.postMessage(
              {
                data: {
                  ...CurrentlyAuthorizedUserInfo,
                  key: data.data.key
                },
                type: "AuthVerificationConnectionVerified"
              },
              "http://localhost:4000"
            );
          }
        }

        // Step three, user is obtained. User is then submitted and logged in.
        if (
          data.type === "AuthVerificationConnectionVerified" &&
          data.data.key
        ) {
          const { data: userData }: Object = data;
          this.connectUser(userData);
        }

        return true;
      }

      return false;
    };
  };

  postMessage = (data: Object): void => {
    !!window &&
      window.top.postMessage(
        { type: "AuthVerificationConnection", data: data },
        "http://localhost:4000"
      );
  };

  getCurrentlyAuthorizedUserInfo = async () => {
    const { data: { viewer } }: Object = await fetch("/api/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept-Encoding": "gzip",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/graphql"
      },
      mode: "cors",
      cache: "default",
      body: `{
              viewer {
                name
                token
                homeworld {
                  name
                  residentConnection {
                    edges {
                      node {
                        name
                      }
                    }
                  }
                }
              }
            }`
    }).then(response => response.json());

    return viewer;
  };

  handleLogin = (formName: string): Function => (props: Object): void => {
    this.setState(() => ({
      signedIn: this.state.signedIn.set(formName, Map(props))
    }));
    this.postMessage(props);
  };

  handleLogOut = (logoutName: string): Function => (
    event: SyntheticEvent
  ): void => {
    this.setState(() => ({
      signedIn: this.state.signedIn.remove(logoutName)
    }));
  };

  componentDidMount() {
    window &&
      window.addEventListener(
        "message",
        this.receiveMessage(Math.random()),
        false
      );
  }

  shouldComponentUpdate(nextState: State) {
    return this.state.signedIn !== nextState.signedIn;
  }

  render() {
    const { signedIn } = this.state;

    return (
      <Wrapper>
        {!!signedIn.size && !!signedIn.has("StarWars")
          ? <Welcome
              title={"Star Wars user logged in inside iframe!"}
              username={signedIn.getIn(["StarWars", "name"])}
              onLogoutSubmit={this.handleLogOut("StarWars")}
            />
          : <Login
              prefix={"StarWars"}
              title={"Star Wars login terminal inside iframe"}
              onLoginSubmit={this.handleLogin("StarWars")}
            />}
      </Wrapper>
    );
  }
}

export default App;
