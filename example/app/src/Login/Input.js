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

// A functional component, since there's no internal state in this component
const Input = ({
  required,
  label,
  prefix,
  ...props
}: Props): React$Element<*> => {
  const forLabel = prefix + props.name;
  return (
    <View>
      <Label required={!!required} htmlFor={forLabel}>{label}</Label>
      <TextInput id={forLabel} {...props} />
    </View>
  );
};

export default Input;
