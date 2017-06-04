// @flow
import React from "react";
import { Map, type Map as ImmutableMap } from "immutable";
import { Wrapper, Text, View } from "./Tags/Tags";
import LoadAsync from "./LoadAsync/LoadAsync";
import DocumentTitle from "./Document/Title";
import graphql from "./Connection";

export type MessageEventWithOptions = MessageEvent & {
  data: { type: string, data: Object }
};

export type State = {
  signedIn: ImmutableMap<string, ImmutableMap<string, string>>
};

// We load components in asynchronously using React Loadable.
// That way we minimize initial paint time of files and perceved load time.
const Welcome = LoadAsync({ loader: () => import("./Welcome/Welcome") });
const Login = LoadAsync({ loader: () => import("./Login/Login") });
const Ping = LoadAsync({ loader: () => import("./PingTest/Ping") });
const Iframe = LoadAsync({ loader: () => import("./Iframe/Iframe") });

// Initiate React component. The <*> syntax at the end
// indicates type, and is a flowtype abstraction to javascript.
class App extends React.Component<*, State, *> {
  // Initial state
  state = {
    signedIn: Map()
  };

  // Userbases, which are currently active on this site.
  UserBases: Array<string> = ["StarWars", "StarWarsCharacters"];

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
    // correclty and we can proceed to sign in the user on all accounts.
    if (!response.error && response.name && response.token) {
      this.UserBases
        // Skip every where the user is already
        // signed in by filtering them out of the list
        .filter(userBase => !this.state.signedIn.has(userBase))
        .forEach(userBase =>
          this.setState(() => ({
            signedIn: this.state.signedIn.set(userBase, Map(response))
          }))
        );
    }

    return response;
  };

  // The heart of the operation. The logic can be constructed many
  // ways, but in my case; A key is curried into an asynchronously
  // run function, trapping a key in the closure of the main function
  // used by the event listener. This gives me a persistent, random
  // key to check as an added security mesure as the key will have
  // to be guessed if people try acessing this function manually.
  receiveMessage = (key: number): Function => async (
    event: MessageEventWithOptions
  ): Promise<boolean> => {
    // Find an iframe, if an iframe is at all present.
    const iframe = document && document.querySelector("iframe");
    // Destructure origin, data and source from
    // event for easier, more readable use.
    const { origin, data, source } = event;
    // Set the submit to address based on origin. This makes the
    // response logic more dynamic since this function will also
    // be replying to itself as it accepts same-window messages.
    const SubmitToAddress = source === window
      ? "http://localhost:4000"
      : "http://localhost:4050";

    // Verefy that the request is from a good origin and source. Returns
    // true if it is, false otherwise. This helps with testing the funcion.
    if (
      (origin === "http://localhost:4000" && source === window) ||
      (origin === "http://localhost:4050" &&
        source === (iframe && iframe.contentWindow))
    ) {
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
          SubmitToAddress
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
            SubmitToAddress
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

  // this is a quick helper to post message to window. This is
  // helpfull, as two messages are posted at once. One to the
  // window, and one to the iframe if an iframe is present.
  postMessage = (
    data: Object,
    type: string = "AuthVerificationConnection"
  ): void => {
    const iframe = document && document.querySelector("iframe");
    !!iframe &&
      iframe.contentWindow.postMessage({ type, data }, "http://localhost:4050");
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

  // A curried handle loggin function. This is beneficial as a function can
  // be defined directly with form name stored in closure, and it avoids
  // defining a new function on every page request or component update
  // as it would be if the function is defined with arguments on use.
  handleLogin = (formName: string) => (props: Object): void => {
    // Set state of login on login, of the current logged in field.
    this.setState(() => ({
      signedIn: this.state.signedIn.set(formName, Map(props))
    }));

    // Now that a user is authorized, post a message to
    // inform listening windows that someone is logged in.
    this.postMessage(props);
  };

  // This takes care of logging out users. This isn't a hard loggout, the cookie
  // is still present; but for the purpuse of this prototype it will suffice.
  handleLogOut = (logoutName: string) => (event: SyntheticEvent): void => {
    this.setState(() => ({
      signedIn: this.state.signedIn.remove(logoutName)
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
    // this is a simple function to replace login field names with space separated
    // words by injecting spaces between small letters and capital letters.
    const splitSpaces = text => text.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Returns to virtual state, which will render to DOM.
    // I also map trhough each user base, check if signed in
    // and render the correct output based on signin status
    return (
      <Wrapper>
        <DocumentTitle>AuthJazz</DocumentTitle>
        <Ping callback={this.postMessage} />
        <View>
          <Text>
            Have fun logging in as any Star Wars character in
            the database.
          </Text>
          <Text>HINT: the password is always password</Text>
        </View>
        {this.UserBases.map(
          part =>
            signedIn.has(part)
              ? <Welcome
                  key={part}
                  title={`${splitSpaces(part)} user logged in!`}
                  username={signedIn.getIn([part, "name"])}
                  onLogoutSubmit={this.handleLogOut(part)}
                />
              : <Login
                  key={part}
                  prefix={part}
                  title={`${splitSpaces(part)} login`}
                  onLoginSubmit={this.handleLogin(part)}
                />
        )}
        <Text>
          What follows is an iframe, the colors are different to illustrate
          that we're accessing a different website
        </Text>
        <Iframe title="application_display" src="http://localhost:4050" />
      </Wrapper>
    );
  }
}

export default App;
