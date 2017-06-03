// @flow
import Loadable from "react-loadable";
import React from "react";

type Props = {
  isLoading: boolean,
  error: boolean,
  pastDelay: boolean
};

// Using react-loadable to easily deffer components and
// load them in asynchronously. This reduces initial file
// load size and only loads used components by the user.
export default function LoadAsync(opts: Object): Loadable {
  return Loadable({
    // These properties are internal properties of react-loadable
    LoadingComponent({ isLoading, error, pastDelay }: Props) {
      // Something to display if we're past delay, and the component is still loading
      if (isLoading && pastDelay) {
        return <div>Loading...</div>;
      }
      // Something to display if an error ocurred
      if (error) {
        return <div>Error! Component failed to load</div>;
      }
      // Return null initially, this displays nothing.
      return null;
    },
    // A small delay makes sure the user doesn't vitness any unneeded flash state.
    delay: 200,
    // spread in all other options, if any exist
    ...opts
  });
}
