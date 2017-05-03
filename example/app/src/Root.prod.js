// @flow
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
// babel-polyfill will be transformed to required polyfills
import "babel-polyfill";

ReactDOM.render(<App />, document.getElementById("root"));
