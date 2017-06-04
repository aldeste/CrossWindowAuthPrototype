// @flow
import React from "react";
import { Text, View, Form, Title } from "../Tags/Tags";
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

// Login component, a pure component will shallow compare this
// state to next on update, that's good enough for this usecase
class Login extends React.PureComponent<*, Props, State> {
  // Initial state, empty username and password. These
  // fields are the input fields present in the form section
  state = { username: "", password: "" };

  // This handles the input change and will
  // be bound to onChange on each input field.
  handleInputChange = (event: SyntheticInputEvent) => {
    const { value, name } = event.target;

    // Name is the name of the input field, this will
    // programatically map directly to the correct section in state.
    this.setState(() => ({
      // Strings can't start with space,
      // Strings can't have a double space
      [name]: value.replace(/^\s+/, "").replace(/\s{2,}/g, " ")
    }));
  };

  // This will be bound to fire when someone logs in.
  handleOnSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Attempt to log in the user.
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

    // An error has been reached.
    if (user.error) {
      return this.setState(() => ({ error: true }));
    }

    // Send the fully authenticated user to the onLoginSubmit prop.
    return this.props.onLoginSubmit(user);
  };

  render() {
    // Username must have a minimum of 3 characters, and
    // password must have atleast 5 characters. For fun, I can
    // make the button disabled if these criterias are not met.
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
