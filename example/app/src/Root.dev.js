import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppContainer } from "react-hot-loader";
import "./Document/Styles";
// babel-polyfill will be transformed to required polyfills
import "babel-polyfill";

const renderApp = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("root")
  );
export default renderApp;
renderApp(App);

// Hot Module Replacement API.
// This will render components on component updates and edits.
if (module.hot) {
  module.hot.accept("./App", () => {
    renderApp(App);
  });
}
