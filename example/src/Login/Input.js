// @flow
import React from "react";
import { TextInput, Label, View } from "../Tags";

type Props = {
  label: string,
  placeholder: string,
  name: string,
  value: string,
  onChange: Function,
  type?: string,
  required?: boolean
};
const Input = ({ required, label, ...inputProps }: Props): React$Element<*> => (
  <View>
    <Label required={!!required} htmlFor={inputProps.name}>{label}</Label>
    <TextInput {...inputProps} />
  </View>
);

export default Input;
