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

// This is a component that will display private
// user information if the user is logged in.
export default class About extends React.Component<*, State, *> {
  // Default state has no viewer, us loading, and has no error.
  state = { viewer: null, loading: true, error: false };

  // Gets the currently authorized user.
  getCurrentlyAuthorizedUsersInfo = async (): Promise<void> => {
    // Veiwer is processed to the currently activated used
    // in the backend. GraphQL gives composable query, what
    // we see here is exactly what we'll get from the request
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

    // If a viewer has been found and returned,
    // cache it to state and switch loading to false.
    if (!!viewer) {
      return this.setState(() => ({ viewer, loading: false }));
    }

    // Othwesie keep the viewer as null and set error to true
    return this.setState(() => ({ viewer: null, loading: false, error: true }));
  };

  // Immediately start fetching user info when component mounts
  componentDidMount() {
    this.getCurrentlyAuthorizedUsersInfo();
  }

  render() {
    // Display nothing if component errors.
    if (this.state.error) {
      return null;
    }

    // Render profile once viewer is loaded and we've finished loading
    if (this.state.viewer !== null && !this.state.loading) {
      return <ProfileInfo viewer={this.state.viewer} />;
    }

    // Display nothing while still loading
    return null;
  }
}
