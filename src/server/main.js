// @flow
import express from "express";
import GraphHTTP from "express-graphql";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { APP_PROTOCOL, APP_HOST, APP_PORT } from "../../config/config";
import Schema from "../schema";
import hrTimer from "../utils/hrTimer";
import { createLoaders } from "../schema/apiHelper";
import { fromAuthToken, validateUser } from "./auth";
import { encode, decode } from "./encodeDecode";

import type { $Request, $Response, $Application, Middleware } from "express";
import type { UserTokenData } from "./auth";

// Initialize express
const app: $Application = express();
const parseJson: Middleware = bodyParser.json();

// Initialize cookieParser to easier use it as a middleware later
const parseCookies: Middleware = cookieParser("v2TqCgORps-IgwsZmQRDl", {
  decode
});

// Returns an array of arguments needed to set cookies
const setCookie = (name: string, params: Object): [string, string, Object] => {
  return [
    name,
    JSON.stringify(
      Object.assign({}, params, { cookieBirth: new Date() / 1000 })
    ),
    { maxAge: 900000, httpOnly: true, signed: true, encode }
  ];
};

// This will be used to login users with username and passwords
app.post(
  "/login",
  parseCookies,
  parseJson,
  async (req: $Request, res: $Response): Promise<$Response> => {
    const { body }: Object = req;
    if (!body.password && !body.name) {
      res.status(404);
      return res.send({});
    }
    const response = await validateUser({
      name: body.name,
      password: body.password
    });

    // set a cookie containing the valid user
    if (!response.error) {
      res.cookie(...setCookie("herring", response));
    }

    return res.send(response);
  }
);

// Redirect all requests to root to graphql
app.all("/", (req: $Request, res: $Response): $Response =>
  res.redirect("/graphql")
);

app.use(
  "/graphql",
  parseCookies,
  GraphHTTP(async (req: $Request, res: $Response): Object => {
    type signedCookiesType = { signedCookies: Object | { herring: string } };
    type ViewerType = UserTokenData | {};

    console.log("\x1B[2J\x1B[0f\u001b[0;0H");
    console.log(chalk.green.inverse(new Date()));

    // Get all signed cookies, then if our herring cookie exists,
    // get user from auth token, otherwise define viewer as empty object.
    const { signedCookies }: signedCookiesType = req;

    // Check if herring cookie exists
    const currentUserByCookie: Object = !!signedCookies &&
      !!signedCookies.herring
      ? JSON.parse(signedCookies.herring)
      : {};

    // If cookie is older than 60 seconds, this will be true. Otherwise false.
    const shouldCookieupdate: boolean = !!currentUserByCookie.cookieBirth
      ? new Date() / 1000 - currentUserByCookie.cookieBirth > 60
      : false;

    const viewer: ViewerType = shouldCookieupdate
      ? await fromAuthToken(currentUserByCookie.id)
      : currentUserByCookie;

    // Sets cookie again to keep it fresh
    if (shouldCookieupdate) {
      res.cookie(...setCookie("herring", viewer));
    }

    // Display current cookies in coonsole, if there are any
    if (Object.keys(req.signedCookies).length) {
      console.log();
      console.log("Current signed cookies");
      Object.keys(req.signedCookies).forEach((cookie: string): void => {
        console.log(chalk.bold(cookie));
        console.log(JSON.parse(req.signedCookies[cookie]));
      });
      console.log();
    }

    // A simple helper function to time our requests.
    // Its a higher order function that initiates a timer,
    // and echoes when the returned function is called.
    const timer = hrTimer();

    // Return a graphql response.
    return {
      schema: Schema,
      graphiql: true,
      pretty: false,
      context: {
        // Create loaders and pass current viewer down to loaders.
        // Loaders are our servielayer, and will be used to fetch
        // data uppon request
        loaders: createLoaders(viewer),
        // Pass the fully hydrated viewer object down through the context
        viewer
      },
      extensions() {
        return { timeTaken: timer().prettyPrint };
      }
    };
  })
);

// Ggive a friendly message that the app us up and running
const server: $Application = app.listen(APP_PORT, (): void => {
  const address: string = `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/`;
  console.log(chalk.blue(`App is running at ${chalk.magenta.bold(address)}`));
});

// Export server, this helps with testing.
export default server;
