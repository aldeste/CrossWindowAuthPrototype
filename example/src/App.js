// @flow
import React, { Component } from "react";
import Login from "./Login/Login";
import Wrapper from "./Tags/Wrapper";

class App extends Component<*, *, *> {
  render() {
    return (
      <Wrapper>
        <Login title="Star Wars fanclub login terminal" />
        <Login title="Breaking Bad fanclub login terminal" />
      </Wrapper>
    );
  }
}

export default App;
