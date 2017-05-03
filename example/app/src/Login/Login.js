// @flow
import React from "react";
import { Text, View, Form, Title } from "../Tags";
import LoginButton from "./LoginButton";
import Input from "./Input";

type State = {
  username: string,
  password: string
};

type Props = {
  title: string
};

class Login extends React.PureComponent<*, Props, State> {
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
        <Title>{this.props.title}</Title>
        <Text>Please log in</Text>
        <Form>
          <Input
            label="Username"
            placeholder="Username"
            name="username"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <Input
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
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
