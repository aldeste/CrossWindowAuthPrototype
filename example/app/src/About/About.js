// @flow
import React from "react";
import Homeworld from "./Homeworld";
import { View, Text, TitleH2, TitleH3 } from "../Tags";

type QueryResults = {
  viewer: {
    name: string,
    birthYear: string,
    eyeColor: string,
    hairColor: string,
    gender: string,
    homeworld: {
      name: string,
      residentConnection: {
        edges: Array<{
          node: {
            name: string
          }
        }>
      }
    }
  }
};

type State = { viewer: ?QueryResults, loading: boolean, error: boolean };

const ViewInfo = ({ viewer }: QueryResults) => {
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

export default class About extends React.Component<*, State, *> {
  state = { viewer: null, loading: true, error: false };

  getCurrentlyAuthorizedUsersInfo = async (): Promise<void> => {
    const {
      data: { viewer }
    }: { data: QueryResults } = await fetch("/api/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept-Encoding": "gzip",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/graphql"
      },
      mode: "cors",
      cache: "default",
      body: `{
              viewer {
                name
                birthYear
                eyeColor
                hairColor
                gender
                homeworld {
                  name
                  residentConnection {
                    edges {
                      node {
                        name
                      }
                    }
                  }
                }
              }
            }`
    }).then(response => response.json());

    if (!!viewer) {
      return this.setState(() => ({ viewer, loading: false }));
    }

    return this.setState(() => ({ viewer: null, loading: false, error: true }));
  };

  componentDidMount() {
    this.getCurrentlyAuthorizedUsersInfo();
  }

  render() {
    if (this.state.error) {
      return null;
    }

    if (this.state.viewer !== null && !this.state.loading) {
      return <ViewInfo viewer={this.state.viewer} />;
    }

    return null;
  }
}
