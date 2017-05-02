// @flow
import React, { Component } from "react";
import Login from "./Login/Login";
import { Wrapper } from "./Tags";
import { View, Title, Button, Text } from "./Tags";

type MessageEventWithOptions = {
  ...MessageEvent,
  data: { type: string, data: string }
};

class App extends Component<*, *, *> {
  state = { user: "" };

  receiveMessage = (event: MessageEventWithOptions) => {
    if (event.origin !== "http://localhost:4000") return;
    if (event.data.type === "AuthVerificationConnection") {
      this.setState(() => ({ user: event.data.data }));
    }
  };

  componentDidMount() {
    // window && window.addEventListener("message", this.receiveMessage, false);
  }

  render() {
    return (
      <Wrapper>
        <View>
          <Title>This is just for active testing</Title>
          <Button
            onClick={async () => {
              const user = await fetch("/connect", {
                method: "POST",
                credentials: "include",
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "Content-Type": "application/json"
                },
                mode: "cors",
                cache: "default",
                body: JSON.stringify({ token: "eggs" })
              }).then(response => response.json());
              console.log("Returned response is", typeof user, user);
              if (typeof user === "object")
                this.setState(() => ({ user: user.user }));
              // window.postMessage(
              //   { type: "AuthVerificationConnection", data: user },
              //   "http://localhost:4000"
              // );
            }}
            alternative={true}
          >
            Click to ping
          </Button>
          <Text>{this.state.user}</Text>
        </View>
        <Login title="Star Wars login" />
        <Login title="Breaking Bad login" />
      </Wrapper>
    );
  }
}

export default App;
