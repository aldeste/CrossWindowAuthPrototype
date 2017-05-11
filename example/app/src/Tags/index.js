// @flow
import Loadable from "react-loadable";
import React from "react";

const LoadingComponent = ({
  isLoading,
  error,
  pastDelay
}: {
  isLoading: boolean,
  error: boolean,
  pastDelay: boolean
}) => {
  if (isLoading) {
    return pastDelay ? <div>Loading...</div> : null;
  }
  if (error) {
    return <div>Error! Component failed to load</div>;
  }
  return null;
};

const Button = Loadable({
  loader: () => import("./Button"),
  LoadingComponent,
  delay: 200
});
const Text = Loadable({
  loader: () => import("./Text"),
  LoadingComponent,
  delay: 200
});
const View = Loadable({
  loader: () => import("./View"),
  LoadingComponent,
  delay: 200
});
const TextInput = Loadable({
  loader: () => import("./TextInput"),
  LoadingComponent,
  delay: 200
});
const Wrapper = Loadable({
  loader: () => import("./Wrapper"),
  LoadingComponent,
  delay: 200
});
const Title = Loadable({
  loader: () => import("./Title"),
  LoadingComponent,
  delay: 200
});
const Label = Loadable({
  loader: () => import("./Label"),
  LoadingComponent,
  delay: 200
});
const Form = Loadable({
  loader: () => import("./Form"),
  LoadingComponent,
  delay: 200
});

export { Button, Text, View, TextInput, Wrapper, Title, Label, Form };
