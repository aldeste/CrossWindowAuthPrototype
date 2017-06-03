// @flow
import React from "react";

// This is a higher order component. What that
// means is that this function takes a component...
export default (WrappedComponent: *) =>
  // ...and returns another component. This is usefull as I'm able
  // to remove some logic from the input component into this one,
  // cleaning up code and composing. This is called a higher order
  // component, and is a very common composition pattern in React.
  class extends React.PureComponent<*, *, *> {
    interval: void;

    // This method posts a message about current
    // document height to the parent window.
    notifyHeight = () =>
      window.parent.postMessage(
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

    // Attach an interval to run the notifyHeight window, as
    // a way to monitor this the height and update frequently.
    componentWillMount() {
      this.interval = window.setInterval(this.notifyHeight, 500);
    }

    // Clena up the interval if the component will unmount, this
    // prevents it from running even if the scoped component is removed
    componentWIllUnount() {
      clearInterval(this.interval);
    }

    render() {
      // Renders the wrapped component, passing thorugh additional props.
      return <WrappedComponent {...this.props} />;
    }
  };
