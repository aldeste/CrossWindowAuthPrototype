// @flow
import React from "react";
import { Text, View, Title, Button } from "../Tags";

type Props = {
  title: string,
  username: string
};

type State = void;

class Welcome extends React.Component<void, Props, State> {
  render() {
    return (
      <View>
        <Title>{this.props.title}</Title>
        <Text>You're logged in as {this.props.username}</Text>
        <Button alternative>Log out</Button>
      </View>
    );
  }
}

export default Welcome;
