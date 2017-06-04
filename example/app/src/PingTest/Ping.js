// @flow
import React from "react";
import { View, Title, Button, Text } from "../Tags/Tags";
import graphql from "../Connection";

// The state can ether be an empty object, or
// contain a user and, maybe, a time string
type State =
  | {}
  | {
      user: string,
      time?: string
    };

type Props = { callback: ?Function };

type GraphQLResult = {
  data: ?{ person: { name: string, token: string } },
  extensions: { timeTaken: string }
};

// React component extending PureComponent, which will do a
// shallow compare to check if component should update or not.
export default class Ping extends React.PureComponent<*, Props, State> {
  state = {};

  // Resolves a token, or rather an user id for simplification, to a user.
  resolveToken = async (
    token: number
  ): Promise<?{ user: Object, time: string }> => {
    // Destructure data and time from graphql result.
    const {
      data,
      extensions: { timeTaken: time }
    }: GraphQLResult = await graphql`{
      person(personId: ${token}) {
        name
        token
      }
    }`;

    // Ensure results were obtained, return null otherwise.
    if (!!data && data.person && data.person.name && time) {
      return { user: data.person, time };
    }

    return null;
  };

  // Asynchronous function that runs on click
  handleClick = async (): Promise<void> => {
    // Generaets aa user based on random generated number.
    const user = await this.resolveToken(Math.ceil(Math.random() * 80));

    // If user returned, proceed.
    if (!!user) {
      // If a callback property exists, submit user to callback property.
      // The callback prop submitts the user for login, the exact same way
      // users are submitted for loign when loggin in and authenticating.
      this.props.callback && this.props.callback(user.user);
      // Set current state to fetched user.
      this.setState(() => user);
    }
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
