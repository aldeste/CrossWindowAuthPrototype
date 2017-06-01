// @flow
import React from "react";
import ProfileInfo from "./ProfileInfo";
import graphql from "../Connection";

export type QueryResults = {
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

export default class About extends React.Component<*, State, *> {
  state = { viewer: null, loading: true, error: false };

  getCurrentlyAuthorizedUsersInfo = async (): Promise<void> => {
    const { data: { viewer } }: { data: QueryResults } = await graphql`{
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
    }`;

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
      return <ProfileInfo viewer={this.state.viewer} />;
    }

    return null;
  }
}
