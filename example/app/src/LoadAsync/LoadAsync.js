// @flow
import Loadable from "react-loadable";
import React from "react";

type Props = {
  isLoading: boolean,
  error: boolean,
  pastDelay: boolean
};

export default function LoadAsync(opts: Object): Loadable {
  return Loadable({
    LoadingComponent({ isLoading, error, pastDelay }: Props) {
      if (isLoading && pastDelay) {
        return <div>Loading...</div>;
      }
      if (error) {
        return <div>Error! Component failed to load</div>;
      }
      return null;
    },
    delay: 200,
    ...opts
  });
}
