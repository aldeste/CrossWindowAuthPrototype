// @flow
import React from "react";
import { View, Title, Button, Text } from "../Tags";

type State =
  | {}
  | {
      user: string,
      time?: string
    };

type Props = { token?: ?string };

export async function resolveToken(token: ?string): Promise<Object> {
  if (token) {
    const {
      data: { viewer: { name: user } },
      extensions: { timeTaken: time }
    }: Object = await fetch("/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/graphql"
      },
      mode: "cors",
      cache: "default",
      body: `{ viewer(personId: 4) { name } }`
    }).then(response => response.json());

    // window.postMessage(
    //   { type: "AuthVerificationConnection", data: user },
    //   "http://localhost:4000"
    // );
    return { user, time };
  }
  return {};
}

export default class extends React.PureComponent<*, Props, State> {
  state = {};

  handleClick = async () => {
    const user = await resolveToken(this.props.token);
    this.setState(user);
  };

  render() {
    return (
      <View>
        <Title>Connection testing field</Title>
        <Button onClick={this.handleClick} alternative={true}>
          Click to ping
        </Button>
        {!!this.state.user && <Text>{this.state.user}</Text>}
        {!!this.state.time && <Text>{this.state.time}</Text>}
      </View>
    );
  }
}
