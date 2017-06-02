// @flow
import React from "react";
import { View, Title, Button, Text } from "../Tags";
import graphql from "../Connection";

type State =
  | {}
  | {
      user: string,
      time?: string
    };

type Props = { callback: ?Function };

export default class extends React.PureComponent<*, Props, State> {
  state = {};

  resolveToken = async (token: number): Promise<Object> => {
    const {
      data: { person: user },
      extensions: { timeTaken: time }
    }: Object = await graphql`{
      person(personId: ${token}) {
        name
        token
      }
    }`;

    return { user, time };
  };

  handleClick = async () => {
    const randomNumber: number = Math.ceil(Math.random() * 80);
    const user = await this.resolveToken(randomNumber);
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
