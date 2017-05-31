// @flow
import React from "react";
import { Text, View } from "../Tags";

type Props = {
  name: string,
  residents: Array<string>
};

export default function Homeworld({
  name,
  residents
}: Props): React$Element<*> {
  if (!!residents.length) {
    return (
      <View>
        {name && name !== "unknown"
          ? <Text>
              You're from {name}!
              Other people are also from there!
              Maybe you know them?
            </Text>
          : <Text>
              We don't know where you're from,
              just like some of the other characters.
              Maybe you know them?
            </Text>}
        <Text>{residents.join(", ")}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>You're from ${name}!</Text>
    </View>
  );
}
