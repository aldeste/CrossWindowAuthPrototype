// @flow
import React from "react";
import { View, TitleH2, TitleH3, Text } from "../Tags";
import Homeworld from "./Homeworld";
import { type QueryResults } from "./About";

const ProfileInfo = ({ viewer }: QueryResults) => {
  const residents =
    viewer.homeworld &&
    viewer.homeworld.residentConnection &&
    viewer.homeworld.residentConnection.edges
      .filter(({ node }) => node.name !== viewer.name)
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
