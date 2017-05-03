// @flow
import React from "react";
import { Button } from "../Tags";

const LoginButton = ({
  disabled,
  disabledValue,
  value,
  ...props
}: {
  disabled: boolean,
  disabledValue: string,
  value: string,
  props?: Object
}) => (
  <Button disabled={!!disabled} {...props}>
    {disabled ? disabledValue : value}
  </Button>
);

export default LoginButton;
