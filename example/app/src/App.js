// @flow
import React from "react";
import Wrapper from "./Tags/Wrapper";
import DocumentTitle from "./Document/Title";
import Login from "./Login/Login";
import Ping from "./PingTest/Ping";

// type MessageEventWithOptions = {
//   ...MessageEvent,
//   data: { type: string, data: string }
// };

class App extends React.Component<*, *, *> {
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

  signIn = (formName: string) => (props: Object) => {
    this.setState(() => ({ [formName]: { props } }));
  };

  render() {
    return (
      <Wrapper>
        <DocumentTitle>This is a demo page</DocumentTitle>
        {this.state && <p>{JSON.stringify(this.state, null, 2)}</p>}
        <Ping token="Hello" />
        <Login
          title="Star Wars login"
          onLoginSubmit={this.signIn("StarWars")}
        />
        <Login
          title="Breaking Bad login"
          onLoginSubmit={this.signIn("BreakingBad")}
        />
      </Wrapper>
    );
  }
}

export default App;
