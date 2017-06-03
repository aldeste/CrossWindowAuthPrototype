// @flow
import React from "react";
import { Map as ImmutableMap } from "immutable";
import { Wrapper } from "../Tags";
import LoadAsync from "../LoadAsync/LoadAsync";
import { type State, type MessageEventWithOptions } from "../App";
import graphql from "../Connection";
import HeightNotifierHOC from "../Iframe/HeightNotifierHOC";

// We load components in asynchronously using React Loadable.
// That way we minimize initial paint time of files and perceved load time.
const Welcome = LoadAsync({ loader: () => import("../Welcome/Welcome") });
const Login = LoadAsync({ loader: () => import("../Login/Login") });

// This part will only render within an iframe. The logic is different
// from the main app, so a separate file is used to illustrate a
// completely separate service despite this enducing some code repetition.
class IframeApp extends React.Component<*, State, *> {
  // Initial state, an immutable map element.
  state = {
    signedIn: ImmutableMap()
  };

  // This connects a user based on data. The user is validated to a cookie behind the scenes.
  // This is the main entryway that logs an user in simply by a token.
  connectUser = async (data: Object) => {
    // Use fetch to push the user in and log in the user.
    const response: Object = await fetch("/api/connect", {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept-Encoding": "gzip",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({ data })
    }).then(response => response.json());

    // If a valid response is returned, the user is signed in
    // correclty and we can proceed to sign in the user.
    if (!response.error && response.name && response.token) {
      this.setState(() => ({
        signedIn: this.state.signedIn.set("StarWars", ImmutableMap(response))
      }));
    }

    return response;
  };

  // This is another implementation similar to the one found in the outer window.
  // Here, since there's only one login system on this website, we eliminate any
  // requests comming from the same window.
  receiveMessage = (key: number): Function => async (
    event: MessageEventWithOptions
  ): Promise<boolean> => {
    const { origin, data, source } = event;

    // Verefy that the request is from a good origin and source. Returns
    // true if it is, false otherwise. This helps with testing the funcion.
    if (origin === "http://localhost:4000" && source === window.parent) {
      // Step one, send a request to message source asking which
      // user is logged in. Submit the clojured key as well, this
      // key is unuqie to this function. It makes it possible to
      // keep track that the last reply originated from this call.
      if (data.type === "AuthVerificationConnection") {
        const { data: initialUserData }: Object = data;

        // Source is the source window element that sent the post message this
        // function is reacting to. This posts a message back to that window.
        source.postMessage(
          {
            type: "AuthVerificationConnectionVerify",
            data: { ...initialUserData, key }
          },
          "http://localhost:4000"
        );
      }

      // Step two occurs on the other side, it returns the key recieved
      // from the request and checks which user is signed in and
      // verefied by checking the backend for a verefied user. A token
      // is retrieved, this token could be stored in sessions, cookies
      // and whatever you want. I'm using signed cookies. We could also
      // return a JWT token as well, or whichever security mesure wanted.
      if (data.type === "AuthVerificationConnectionVerify") {
        // Gets a verefied user
        const AuthorizedUser = await this.getCurrentlyAuthorizedUserInfo();
        // Replies to source if a verefied user was found.
        if (!!AuthorizedUser && AuthorizedUser.token === data.data.token) {
          source.postMessage(
            {
              data: {
                ...AuthorizedUser,
                key: data.data.key
              },
              type: "AuthVerificationConnectionVerified"
            },
            "http://localhost:4000"
          );
        }
      }

      // Step three, user is obtained. User is then submitted and logged
      // in based on the token retreived from the other sites backend.
      // This requires that the token is understable by both sides.
      if (data.type === "AuthVerificationConnectionVerified" && data.data.key) {
        const { data: userData }: Object = data;
        this.connectUser(userData);
      }

      return true;
    }

    return false;
  };

  // this is a quick helper to post message to window. This
  // is different to the main apps function as in this case,
  // it's only submitting the message to the top window.
  postMessage = (
    data: Object,
    type: string = "AuthVerificationConnection"
  ): void => {
    window.top.postMessage({ type, data }, "http://localhost:4000");
  };

  // Get name and token of the current authorized user.
  getCurrentlyAuthorizedUserInfo = async () => {
    // This is the result expected from request.
    type CurrentUserType = {
      data: { viewer: { name: string, token: string } }
    };
    // The viewer is resolved to the authorized user behind
    // the scenes. This is where GraphQL shines, we can
    // compose and define direcrly here which fields to fetch.
    const data: ?CurrentUserType = await graphql`{
      viewer {
        name
        token
      }
    }`;

    if (data && data.data && data.data.viewer) {
      return data.data.viewer;
    }
    return null;
  };

  // A handle loggin function. This is different to the main app,
  // since I'm only rendering one signing state in this iframed
  // app version, so there's no need to curry the opperation.
  handleLogin = (props: Object): void => {
    // Set state of login on login
    this.setState(() => ({
      signedIn: this.state.signedIn.set("StarWars", ImmutableMap(props))
    }));

    // Now that a user is authorized, post a message to
    // inform listening windows that someone is logged in.
    this.postMessage(props);
  };

  // This takes care of logging out users. This isn't a hard
  // loggout, the cookie is still present; but for the purpuse of
  // this prototype it will suffice. Again, different to the main
  // app, since we don't need to process multiple login fields.
  handleLogOut = (event: SyntheticEvent): void => {
    this.setState(() => ({
      signedIn: this.state.signedIn.remove("StarWars")
    }));
  };

  // This is a react lifecycle hook, it runs when component is mounted. In
  // this case, I'm using it to attach the main listener for message changes.
  componentDidMount() {
    window.addEventListener(
      // Message event listeners runs every time a message is
      // received by the window.
      "message",
      // Math random is used to give the receiveMessage function
      // a curried entrypoint, this returns another function which
      // will be called every time this window receives a message
      this.receiveMessage(Math.random()),
      false
    );
  }

  // Another react lifecycle hook. It determines if an update should take place
  // or not and must return a boolean. This is where immutable datastructures
  // shine, as it allows for very easy deep comparisions between current state
  // and next, making it easy to determine if UI and DOM should update or not.
  shouldComponentUpdate(nextState: State) {
    return this.state.signedIn !== nextState.signedIn;
  }

  // React lifecycle hook, this is what renders to the UI.
  render() {
    const { signedIn } = this.state;

    return (
      <Wrapper>
        {!!signedIn.size && !!signedIn.has("StarWars")
          ? <Welcome
              title={"Star Wars user logged in inside iframe!"}
              username={signedIn.getIn(["StarWars", "name"])}
              onLogoutSubmit={this.handleLogOut}
            />
          : <Login
              prefix={"StarWars"}
              title={"Star Wars login terminal inside iframe"}
              onLoginSubmit={this.handleLogin}
            />}
      </Wrapper>
    );
  }
}

// This component is exported wrapped in a HOC, higher order component.
export default HeightNotifierHOC(IframeApp);
