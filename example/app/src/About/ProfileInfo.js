// @flow
import React from "react";
import { View, TitleH2, TitleH3, Text } from "../Tags/Tags";
import Homeworld from "./Homeworld";
import { type QueryResults } from "./About";

// Exports a functional component
const ProfileInfo = ({ viewer }: QueryResults) => {
  // Variable containing residents of the same planet that should render
  const residents =
    viewer.homeworld &&
    viewer.homeworld.residentConnection &&
    viewer.homeworld.residentConnection.edges
      // Remove current user from array
      .filter(({ node }) => node.name !== viewer.name)
      // Return only an array of names
      .map(({ node }) => node.name);

  return (
    <View>
      <TitleH2>{viewer.name}</TitleH2>
      {!!viewer.birthYear && <Text>Born: {viewer.birthYear}</Text>}
      {!!viewer.hairColor && <Text>Your hair is {viewer.hairColor}</Text>}
      {!!viewer.eyeColor && <Text>Your eyes are {viewer.eyeColor}</Text>}
      {!!viewer.gender && viewer.gender !== "none"
        ? <Text>Your gender is {viewer.gender}</Text>
        : <Text>You have no gender</Text>}
      <TitleH3>Your homeworld</TitleH3>
      <Homeworld name={viewer.homeworld.name} residents={residents} />
    </View>
  );
};

export default ProfileInfo;
