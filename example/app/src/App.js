// @flow
import React from "react";
import Wrapper from "./Tags/Wrapper";
import DocumentTitle from "./Document/Title";
import Login from "./Login/Login";
import Welcome from "./Welcome/Welcome";
import { Map, type Map as ImmutableMap } from "immutable";
import Ping from "./PingTest/Ping";

// type MessageEventWithOptions = {
//   ...MessageEvent,
//   data: { type: string, data: string }
// };

type State = {
  signedIn: ImmutableMap<string, ImmutableMap<string, string>>
};

class App extends React.Component<*, State, *> {
  state = {
    signedIn: Map()
  };
  // receiveMessage = (event: MessageEventWithOptions) => {
  //   if (event.origin !== "http://localhost:4000") return;
  //   if (event.data.type === "AuthVerificationConnection") {
  //     this.setState(() => ({ user: event.data.data }));
  //   }
  // };
  //
  // componentDidMount() {
  //   window && window.addEventListener("message", this.receiveMessage, false);
  // }

  signIn = (formName: string): Function => (props: Object): void => {
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

  render() {
    const UserBases: Array<string> = ["StarWars", "StarTrek"];
    const { signedIn } = this.state;

    return (
      <Wrapper>
        <DocumentTitle>This is a demo page</DocumentTitle>
        {UserBases.some(userBase => signedIn.has(userBase)) &&
          <p>{JSON.stringify(signedIn, null, 2)}</p>}
        <Ping token="4" />
        {UserBases.map(
          part =>
            signedIn.has(part)
              ? <Welcome
                  key={part}
                  title={`${part.replace(/([a-z])([A-Z])/g, "$1 $2")} user logged in!`}
                  username={signedIn.getIn([part, "name"])}
                  handleLogOut={this.handleLogOut(part)}
                />
              : <Login
                  key={part}
                  title={`${part.replace(/([a-z])([A-Z])/g, "$1 $2")} login`}
                  onLoginSubmit={this.signIn(part)}
                />
        )}
      </Wrapper>
    );
  }
}

export default App;
