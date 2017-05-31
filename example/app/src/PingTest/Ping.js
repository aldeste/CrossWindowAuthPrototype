// @flow
import React from "react";
import { View, Title, Button, Text } from "../Tags";

type State =
  | {}
  | {
      user: string,
      time?: string
    };

type Props = { token: ?string, callback: ?Function };

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

    return { user, time };
  };

  handleClick = async () => {
    const user = await this.resolveToken(this.props.token);
    this.props.callback && this.props.callback(user.user);
    this.setState(user);
  };

  render() {
    return (
      <View>
        <Title>Connection testing field</Title>
        <Text>
          This will ping a random user thowards the server.
          However. it won't sign in the user since the user isn't verefied
        </Text>
        <Button onClick={this.handleClick} alternative outlined>
          Click to ping
        </Button>
        {!!this.state.user &&
          !!this.state.user.name &&
          <Text>Pinged with user {this.state.user.name}</Text>}
        {!!this.state.time &&
          <Text>The whole opperatiorn took {this.state.time}</Text>}
      </View>
    );
  }
}
