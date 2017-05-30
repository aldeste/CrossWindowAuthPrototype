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

  receiveMessage = (event: MessageEventWithOptions): boolean => {
    const { origin, data, source } = event;
    if (
      origin === "http://localhost:4000" &&
      source === window.parent &&
      data.type === "AuthVerificationConnection"
    ) {
      const { data: submitData }: Object = data;
      this.connectUser(submitData);
      return true;
    }

    return false;
  };

  postMessage = (data: Object): void => {
    !!window &&
      window.top.postMessage(
        { type: "AuthVerificationConnection", data: data },
        "http://localhost:4000"
      );
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
    window && window.addEventListener("message", this.receiveMessage, false);
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
