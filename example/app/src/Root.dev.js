import React from "react";
import ReactDOM from "react-dom";
import LoadAsync from "./LoadAsync/LoadAsync";
import { AppContainer } from "react-hot-loader";
import generateGlobalStyles from "./Document/Styles";
// babel-polyfill will be transformed to required polyfills
import "babel-polyfill";

generateGlobalStyles();

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("root")
  );
export default render;
render(
  LoadAsync({
    loader: () =>
      window.self === window.top
        ? import("./App")
        : import("./IframeContent/App")
  })
);

// Hot Module Replacement API.
// This will render components on component updates and edits.
if (module.hot) {
  module.hot.accept("./App", () => {
    render(
      LoadAsync({
        loader: () =>
          window.self === window.top
            ? import("./App")
            : import("./IframeContent/App")
      })
    );
  });
}
