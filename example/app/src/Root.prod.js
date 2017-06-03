// @flow
import React from "react";
import ReactDOM from "react-dom";
import LoadAsync from "./LoadAsync/LoadAsync";
import generateGlobalStyles from "./Document/Styles";
// babel-polyfill will be transformed to required polyfills
import "babel-polyfill";

// Generate global styles.
generateGlobalStyles();

const App = LoadAsync({
  loader: () =>
    window.self === window.top ? import("./App") : import("./IframeContent/App")
});

ReactDOM.render(<App />, document.getElementById("root"));
