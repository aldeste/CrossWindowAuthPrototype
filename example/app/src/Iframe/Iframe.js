// @flow
import React from "react";
import { Iframe } from "../Tags/Tags";

export type MessageEventWithOptions = MessageEvent & {
  data: { type: string, data: Object }
};

// Export a pure component.
export default class extends React.PureComponent<*, *, *> {
  // Initial state sets height at 500.
  state = { height: 500 };

  // If a height message with the correct properties are submitted to
  // window, update the data to reflect the new height of the iframe content.
  heightManager = (event: MessageEventWithOptions) => {
    const { origin, data } = event;

    if (origin === this.props.src && data.type === "heightUpdate") {
      this.setState(() => ({ height: data.data.height }));
    }
  };

  // Initiate event listener on mount.
  componentDidMount() {
    window.addEventListener("message", this.heightManager, false);
  }

  // Renders an iframe with height set to state height, which will
  // update regularly. This keeps the iframe full-height, making
  // it appear integrated to the website rather than plugged in.
  render() {
    return <Iframe height={`${this.state.height}px`} {...this.props} />;
  }
}
