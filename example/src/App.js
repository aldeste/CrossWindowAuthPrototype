// @flow
import React, { Component } from "react";
import Login from "./Login/Login";
import Wrapper from "./Tags/Wrapper";

class App extends Component<*, *, *> {
  render() {
    return (
      <Wrapper>
        <Login title="Star Wars login" />
        <Login title="Breaking Bad login" />
      </Wrapper>
    );
  }
}

export default App;
