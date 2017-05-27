// @flow
import React from "react";
import { Text, View, Title, Button } from "../Tags";

type Props = {
  title: string,
  username: string,
  onLogoutSubmit: Function
};

export default function Welcome(props: Props): React$Element<*> {
  return (
    <View>
      <Title>{props.title}</Title>
      <Text>You're logged in as {props.username}</Text>
      <Button alternative onClick={props.onLogoutSubmit}>Log out</Button>
    </View>
  );
}
