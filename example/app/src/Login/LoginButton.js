// @flow
import React from "react";
import { Button } from "../Tags/Tags";

type Props = {
  disabled: boolean,
  disabledValue: string,
  value: string,
  props?: Object
};

// Login button functional component, since it doesn't have any internal state.
const LoginButton = ({ disabled, disabledValue, value, ...props }: Props) =>
  <Button disabled={!!disabled} {...props}>
    {disabled ? disabledValue : value}
  </Button>;

export default LoginButton;
