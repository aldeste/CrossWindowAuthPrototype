// @flow
import LoadAsync from "../LoadAsync/LoadAsync";

const Button = LoadAsync({ loader: () => import("./Button") });
const Form = LoadAsync({ loader: () => import("./Form") });
const Iframe = LoadAsync({ loader: () => import("./Iframe") });
const Label = LoadAsync({ loader: () => import("./Label") });
const Text = LoadAsync({ loader: () => import("./Text") });
const TextInput = LoadAsync({ loader: () => import("./TextInput") });
const Title = LoadAsync({ loader: () => import("./Title") });
const View = LoadAsync({ loader: () => import("./View") });
const Wrapper = LoadAsync({ loader: () => import("./Wrapper") });

export { Button, Form, Iframe, Label, Text, TextInput, Title, View, Wrapper };
