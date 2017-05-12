// @flow
import LoadAsync from "../LoadAsync/LoadAsync";

const Button = LoadAsync({
  loader: () => import("./Button")
});
const Text = LoadAsync({
  loader: () => import("./Text")
});
const View = LoadAsync({
  loader: () => import("./View")
});
const TextInput = LoadAsync({
  loader: () => import("./TextInput")
});
const Wrapper = LoadAsync({
  loader: () => import("./Wrapper")
});
const Title = LoadAsync({
  loader: () => import("./Title")
});
const Label = LoadAsync({
  loader: () => import("./Label")
});
const Form = LoadAsync({
  loader: () => import("./Form")
});

export { Button, Text, View, TextInput, Wrapper, Title, Label, Form };
