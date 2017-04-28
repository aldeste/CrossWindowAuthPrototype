// @flow
import React from "react";
import { Text, View, Label, Form, TextInput, Button } from "../Tags";

type Props = {
  title: string,
  username: string
};

type State = void;

class Welcome extends React.Component<void, Props, State> {
  handleInputChange = (event: SyntheticInputEvent) => {
    const { value, name } = event.target;
    this.setState(() => ({
      [name]: value
    }));
  };

  render() {
    return (
      <View>
        <Text>{this.props.title}</Text>
        <Text>You're logged in as {this.props.username}</Text>
        <Button alternative>Log out</Button>
      </View>
    );
  }
}

export default Welcome;
