// @flow
import React from "react";
import { TextInput } from "../Tags";

const Input = (props: { type: string, placeholder: string }) => (
  <TextInput {...props} />
);

export default Input;
