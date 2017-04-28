// @flow
import React from "react";
import { Text, View, Label, Form, TextInput } from "../Tags";
import LoginButton from "./LoginButton";

type Props = {
  title: string
};

type State = {
  username: string,
  password: string
};

class Login extends React.Component<void, Props, State> {
  state = {
    username: "",
    password: ""
  };

  handleInputChange = (event: SyntheticInputEvent) => {
    const { value, name } = event.target;

    this.setState(() => ({
      [name]: value.replace(/\s/g, "")
    }));
  };

  render() {
    const formValid =
      this.state.username.length > 5 && this.state.password.length > 5;

    return (
      <View>
        <Text>{this.props.title}</Text>
        <Form>

          <Label>Enter username</Label>
          <TextInput
            placeholder="Username"
            name="username"
            value={this.state.username}
            onChange={this.handleInputChange}
          />

          <Label>Enter password</Label>
          <TextInput
            placeholder="Password"
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />

          <LoginButton
            disabled={!formValid}
            value="Sign in"
            disabledValue={"Form fields not valid"}
          />

        </Form>
      </View>
    );
  }
}

export default Login;
