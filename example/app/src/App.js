// @flow
import React from "react";
// import { QueryRenderer, graphql } from "react-relay";
// import environment from "./createRelayEnvironment";
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

  render() {
    return (
      <Wrapper>
        <DocumentTitle>This is a demo page</DocumentTitle>
        <Ping token="Hello" />
        <Login title="Star Wars login" />
        <Login title="Breaking Bad login" />
      </Wrapper>
    );
  }
}

export default App;
