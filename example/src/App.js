// @flow
import React, { Component } from "react";
import Login from "./Login/Login";
import { ThemeProvider } from "styled-components";

class App extends Component<*, *, *> {
  render() {
    return (
      <ThemeProvider theme={{ main: "hsl(283,79%,57%)" }}>
        <Login />
      </ThemeProvider>
    );
  }
}

export default App;
