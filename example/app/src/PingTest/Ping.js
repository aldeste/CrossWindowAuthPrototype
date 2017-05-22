// @flow
import React from "react";
import { View, Title, Button, Text } from "../Tags";

type State =
  | {}
  | {
      user: string,
      time?: string
    };

type Props = { token: ?string };

export default class extends React.PureComponent<*, Props, State> {
  state = {};

  resolveToken = async (token: ?string): Promise<Object> => {
    if (!token) return {};
    const {
      data: { person: user },
      extensions: { timeTaken: time }
    }: Object = await fetch("/api/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept-Encoding": "gzip",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/graphql"
      },
      mode: "cors",
      cache: "default",
      body: `{ person(personId: ${token}) { name token personId id } }`
    }).then(response => response.json());

    const iframe = document && document.querySelector("iframe");
    !!window &&
      window.top.postMessage(
        { type: "AuthVerificationConnection", data: user },
        "http://localhost:4000"
      );

    !!iframe &&
      iframe.contentWindow.postMessage(
        { type: "AuthVerificationConnection", data: user },
        "http://localhost:4050"
      );

    return { user, time };
  };

  handleClick = async () => {
    const user = await this.resolveToken(this.props.token);
    this.setState(user);
  };

  render() {
    return (
      <View>
        <Title>Connection testing field</Title>
        <Button onClick={this.handleClick} alternative outlined>
          Click to ping
        </Button>
        {!!this.state.user &&
          !!this.state.user.name &&
          <Text>{this.state.user.name}</Text>}
        {!!this.state.time && <Text>{this.state.time}</Text>}
      </View>
    );
  }
}
