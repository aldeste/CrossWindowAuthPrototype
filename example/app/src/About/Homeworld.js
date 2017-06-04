// @flow
import React from "react";
import { Text, View } from "../Tags/Tags";

type Props = {
  name: string,
  residents: Array<string>
};

// A function that renders homeworld information
export default function Homeworld({
  name,
  residents
}: Props): React$Element<*> {
  // Store which friendly message to display
  // telling user where they're from
  const YoureFrom = !!name && name !== "unknown"
    ? `You're from ${name}`
    : `We don't know where you're from`;

  // Display this if the planet has more residents
  if (!!residents.length) {
    return (
      <View>
        {!!name && name !== "unknown"
          ? <Text>
              {YoureFrom}!
              Other people are also from there!
              Maybe you know them?
            </Text>
          : <Text>
              {YoureFrom},
              just like some of the other characters.
              Maybe you know them?
            </Text>}
        <Text>{residents.join(", ")}</Text>
      </View>
    );
  }
  // If there are no residents, display this.
  return (
    <View>
      <Text>{YoureFrom}!</Text>
    </View>
  );
}
