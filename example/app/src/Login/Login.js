// @flow
import React from "react";
import { Text, View, Form, Title } from "../Tags";
import LoginButton from "./LoginButton";
import Input from "./Input";

type State = {
  username: string,
  password: string,
  error?: boolean
};

type Props = {
  title: string,
  onLoginSubmit: Function,
  prefix: string
};

class Login extends React.PureComponent<*, Props, State> {
  state = { username: "", password: "" };

  handleInputChange = (event: SyntheticInputEvent) => {
    const { value, name } = event.target;

    this.setState(() => ({
      // Strings can't start with space,
      // Strings can't have a double space
      [name]: value.replace(/^\s+/, "").replace(/\s{2,}/g, " ")
    }));
  };

  handleOnSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const user = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept-Encoding": "gzip",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({
        name: this.state.username,
        password: this.state.password
      })
    }).then(response => response.json());

    if (user.error) {
      return this.setState(() => ({ error: true }));
    }

    return this.props.onLoginSubmit(user);
  };

  render() {
    // Username must have a minimum of 3 characters.
    // Password must have atleast 5 characters.
    const formValid =
      this.state.username.length > 2 && this.state.password.length > 4;

    return (
      <View>
        <Title>{this.props.title}</Title>
        <Text>Please log in</Text>
        {this.state.error &&
          <Text>It appears something went terribly wrong!</Text>}
        <Form onSubmit={this.handleOnSubmit}>
          <Input
            label="Username"
            placeholder="Username"
            name="username"
            prefix={this.props.prefix}
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <Input
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            prefix={this.props.prefix}
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
