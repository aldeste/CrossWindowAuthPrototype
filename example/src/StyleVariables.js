// @flow
import React, { Component } from "react";
import { ThemeProvider } from "styled-components";

const mergeStateProp = name =>
  (previousState, props) => ({
    [name]: { ...previousState[name], ...props[name] }
  });

type Props = {
  theme: ?Object,
  children: React$Element<*>
};

class StyleVariables extends Component<*, Props, *> {
  state = {
    theme: {
      main: "hsla(207,56%,46%,1)",
      textColor: "hsla(0,0%,20%,1)",
      buttonHoverText: "hsl(0,0%,100%)",
      fontFamily: `"Roboto", Myriad, "Liberation Sans", "Nimbus Sans L", "Helvetica Neue", Helvetica, Arial, sans-serif;`,
      fontWeight: 300,
      headlineTextColor: "hsla(0,0%,20%,1)",
      headlineFontFamily: `"Roboto", Myriad, "Liberation Sans", "Nimbus Sans L", "Helvetica Neue", Helvetica, Arial, sans-serif;`,
      headlineWeight: 300,
      linkColor: "hsla(207,56%,46%,1)",
    }
  };

  componentWillMount() {
    this.setState(mergeStateProp("theme"));
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        {this.props.children}
      </ThemeProvider>
    );
  }
}

export default StyleVariables;
