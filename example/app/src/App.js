// @flow
import React from "react";
import { Map, type Map as ImmutableMap } from "immutable";
import { Wrapper, Text, Iframe } from "./Tags";
import LoadAsync from "./LoadAsync/LoadAsync";
import DocumentTitle from "./Document/Title";

export type MessageEventWithOptions = {
  ...MessageEvent,
  data: { type: string, data: string }
};

export type State = {
  signedIn: ImmutableMap<string, ImmutableMap<string, string>>
};

// We load components in asynchronously using React Loadable.
// That way we minimize initial paint time of files and perceved load time.
const Welcome = LoadAsync({ loader: () => import("./Welcome/Welcome") });
const Login = LoadAsync({ loader: () => import("./Login/Login") });
const Ping = LoadAsync({ loader: () => import("./PingTest/Ping") });

class App extends React.Component<*, State, *> {
  state = {
    signedIn: Map()
  };

  connectUser = async (data: Object) => {
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

    const UserBases: Array<string> = ["StarWars", "StarWarsCharacters"];

    if (!response.error && response.name && response.token) {
      UserBases.forEach(userBase => {
        this.setState(() => ({
          signedIn: this.state.signedIn.set(userBase, Map(response))
        }));
      });
    }

    return response;
  };

  receiveMessage = (event: MessageEventWithOptions): boolean => {
    const { origin, data, source } = event;
    const iframe = document && document.querySelector("iframe");

    if (
      (origin === "http://localhost:4000" ||
        origin === "http://localhost:4050") &&
      (source === window || (iframe && source === iframe.contentWindow)) &&
      data.type === "AuthVerificationConnection"
    ) {
      const { data: submitData }: Object = data;
      this.connectUser(submitData);
      return true;
    }

    return false;
  };

  handleLogin = (formName: string): Function => (props: Object): void => {
    this.setState(() => ({
      signedIn: this.state.signedIn.set(formName, Map(props))
    }));
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
    const UserBases: Array<string> = ["StarWars", "StarWarsCharacters"];
    const { signedIn } = this.state;
    const token: number = Math.ceil(Math.random() * 50);

    return (
      <Wrapper>
        <DocumentTitle>AuthJazz</DocumentTitle>
        {UserBases.some(userBase => signedIn.has(userBase)) &&
          <Text>{JSON.stringify(signedIn, null, 2)}</Text>}
        <Ping token={token} />
        {UserBases.map(
          part =>
            signedIn.has(part)
              ? <Welcome
                  key={part}
                  title={`${part.replace(/([a-z])([A-Z])/g, "$1 $2")} user logged in!`}
                  username={signedIn.getIn([part, "name"])}
                  onLogoutSubmit={this.handleLogOut(part)}
                />
              : <Login
                  key={part}
                  prefix={part}
                  title={`${part.replace(/([a-z])([A-Z])/g, "$1 $2")} login`}
                  onLoginSubmit={this.handleLogin(part)}
                />
        )}
        <Text>
          What follows is an iframe, the colors are different to illustrate
          that we're accessing a different website
        </Text>
        <Iframe title="application_display" src="http://localhost:4050" />
      </Wrapper>
    );
  }
}

export default App;
