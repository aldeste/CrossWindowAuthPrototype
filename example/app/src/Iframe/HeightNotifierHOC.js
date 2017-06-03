// @flow
import React from "react";

// this function takes a component
export default (WrappedComponent: *) =>
  // and returns another component. This is usefull as I'm able
  // to remove some logic from the input component into this one,
  // cleaning up code and composing. This is called a higher order
  // component, and is a very common composition pattern in React.
  class extends React.PureComponent<*, *, *> {
    interval: void;

    notifyHeight = () =>
      window.top.postMessage(
        {
          type: "heightUpdate",
          data: {
            height:
              document &&
                document.documentElement &&
                document.documentElement.scrollHeight
          }
        },
        "http://localhost:4000"
      );

    componentWillMount() {
      this.interval = window.setInterval(this.notifyHeight, 500);
    }

    componentWIllUnount() {
      clearInterval(this.interval);
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent {...this.props} />;
    }
  };
