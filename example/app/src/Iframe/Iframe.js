// @flow
import React from "react";
import { Iframe } from "../Tags";

export type MessageEventWithOptions = MessageEvent & {
  data: { type: string, data: Object }
};

export default class extends React.PureComponent<*, *, *> {
  state = { height: 500 };

  heightManager = (event: MessageEventWithOptions) => {
    const { origin, data } = event;

    if (origin === this.props.src && data.type === "heightUpdate") {
      this.setState(() => ({ height: data.data.height }));
    }
  };

  componentDidMount() {
    window.addEventListener("message", this.heightManager, false);
  }

  render() {
    return <Iframe height={`${this.state.height}px`} {...this.props} />;
  }
}
