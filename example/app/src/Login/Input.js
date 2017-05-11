// @flow
import React from "react";
import { TextInput, Label, View } from "../Tags";

type Props = {
  label: string,
  placeholder: string,
  name: string,
  value: string,
  prefix: string,
  onChange: Function,
  type?: string,
  required?: boolean
};

const Input = ({
  required,
  label,
  prefix,
  ...props
}: Props): React$Element<*> => (
  <View>
    <Label required={!!required} htmlFor={prefix + props.name}>{label}</Label>
    <TextInput id={prefix + props.name} {...props} />
  </View>
);

export default Input;
