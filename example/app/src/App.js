// @flow
import React from "react";
import { Map, type Map as ImmutableMap } from "immutable";
import { Wrapper, Text, Iframe, View } from "./Tags";
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

class App extends React.Component<*, State, *> {
  state = {
    signedIn: Map()
  };

  // This connects a user based on data. The user is validated to cookie
  connectUser = async (data: Object) => {
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

    const UserBases: Array<string> = ["StarWars", "StarWarsCharacters"];

    if (!response.error && response.name && response.token) {
      UserBases.filter(
        userBase => !this.state.signedIn.has(userBase)
      ).forEach(userBase => {
        this.setState(() => ({
          signedIn: this.state.signedIn.set(userBase, Map(response))
        }));
      });
    }

    return response;
  };

  // The heart of the operation.
  // The logic can be constructed many ways, but in my case;
  // A key is curried into the operation when initialized, this key will be essential
  // to run the entire operation on my end.
  receiveMessage = (key: number): Function => {
    // This is the function the event handler uses
    return async (event: MessageEventWithOptions): Promise<boolean> => {
      const iframe = document && document.querySelector("iframe");
      const { origin, data, source } = event;
      // Set the submit to address based on origin
      const SubmitToAddress = source === window
        ? "http://localhost:4000"
        : "http://localhost:4050";

      // Verefy that the request is from a good origin and source
      if (
        ((origin === "http://localhost:4000" && source === window) ||
          (origin === "http://localhost:4050" &&
            iframe &&
            source === iframe.contentWindow)) &&
        source
      ) {
        // Step one, send a request to message source asking
        // which user is logged in
        if (data.type === "AuthVerificationConnection") {
          const { data: initialUserData }: Object = data;
          source.postMessage(
            {
              type: "AuthVerificationConnectionVerify",
              data: { ...initialUserData, key }
            },
            SubmitToAddress
          );
        }

        // Step two occurs on the other side, it returns the key recieved
        // from the request ( this keeps track that this is a response )
        // and checks which user is signed in and verefied by checking
        // with the backend for a verefied token.
        // This token could be sessions, cookies and whatever you want.
        // I'm using signed cookies.
        if (data.type === "AuthVerificationConnectionVerify") {
          const CurrentlyAuthorizedUserInfo = await this.getCurrentlyAuthorizedUserInfo();
          if (
            CurrentlyAuthorizedUserInfo &&
            CurrentlyAuthorizedUserInfo.token === data.data.token
          ) {
            source.postMessage(
              {
                data: {
                  ...CurrentlyAuthorizedUserInfo,
                  key: data.data.key
                },
                type: "AuthVerificationConnectionVerified"
              },
              SubmitToAddress
            );
          }
        }

        // Step three, user is obtained. User is then submitted and logged in.
        if (
          data.type === "AuthVerificationConnectionVerified" &&
          data.data.key
        ) {
          const { data: userData }: Object = data;
          this.connectUser(userData);
        }

        return true;
      }

      return false;
    };
  };

  postMessage = (
    data: Object,
    type: string = "AuthVerificationConnection"
  ): void => {
    const iframe = document && document.querySelector("iframe");
    !!window && window.top.postMessage({ type, data }, "http://localhost:4000");

    !!iframe &&
      iframe.contentWindow.postMessage({ type, data }, "http://localhost:4050");
  };

  getCurrentlyAuthorizedUserInfo = async () => {
    const data: ?Object = await graphql`{
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

  handleLogin = (formName: string): Function => async (
    props: Object
  ): Promise<?Object> => {
    this.setState(() => ({
      signedIn: this.state.signedIn.set(formName, Map(props))
    }));
    this.postMessage(props);
  };

  handleLogOut = (logoutName: string): Function => (
    event: SyntheticEvent
  ): void => {
    this.setState(() => ({
      signedIn: this.state.signedIn.remove(logoutName)
    }));
  };

  componentDidMount() {
    window &&
      window.addEventListener(
        "message",
        this.receiveMessage(Math.random()),
        false
      );
  }

  shouldComponentUpdate(nextState: State) {
    return this.state.signedIn !== nextState.signedIn;
  }

  render() {
    const UserBases: Array<string> = ["StarWars", "StarWarsCharacters"];
    const { signedIn } = this.state;
    const splitSpaces = text => text.replace(/([a-z])([A-Z])/g, "$1 $2");

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
        {UserBases.map(
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
