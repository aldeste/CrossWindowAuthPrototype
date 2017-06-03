import React from "react";
import ReactDOM from "react-dom";
import LoadAsync from "./LoadAsync/LoadAsync";
import { AppContainer } from "react-hot-loader";
import generateGlobalStyles from "./Document/Styles";
// babel-polyfill will be transformed to required polyfills
import "babel-polyfill";

// Generate global styles. Since I'm only using CSS-in-JS all
// the way, no css file is ever included. This function injects
// global styles. Global styles are considdered an escape hatch,
// and should only be used to style things like :root and body.
generateGlobalStyles();

// Asyncroneously load a file based on wether this fule is
// being read from an iframe or not. Since this is only a
// prototype, this simplifies the logic of having two entryfiles.
const App = LoadAsync({
  loader: () =>
    window.self === window.top ? import("./App") : import("./IframeContent/App")
});

// Render a component to DOM. This is placed on a function
// for testability, but also to enable hot module reloading.
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("root")
  );

render(App);

// Hot Module Replacement API.
// This will render components on component updates and edits.
if (module.hot) {
  module.hot.accept("./App", () => {
    render(App);
  });
}

export default render;
