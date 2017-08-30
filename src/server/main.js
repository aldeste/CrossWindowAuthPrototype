// @flow
import express from "express";
import GraphqlHTTP from "express-graphql";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {
  APP_PROTOCOL,
  APP_HOST,
  APP_PORT,
  APP_FRONT_PORT
} from "../../config/config";
import Schema from "../schema";
import hrTimer from "../utils/hrTimer";
import { createLoaders } from "../schema/apiHelper";
import { fromAuthToken, validateUser } from "./auth";
import { encode, decode } from "./encodeDecode";

import type {
  $Request,
  $Response,
  $Application,
  Middleware,
  NextFunction
} from "express";

// Initialize express
const app: $Application = express();

// Settup bodyParser to parse json
const parseJson: Middleware = bodyParser.json();

// Settup cookieParser to easier use it as a middleware later
const parseCookies: Middleware = cookieParser("v2TqCgORps-IgwsZmQRDl", {
  decode
});

// Helper function to use to set cookies. It
// returns an array needed to set cookies.
const setCookie = (name: string, params: Object): [string, string, Object] => {
  return [
    // Cookie name
    name,
    // Cookie content
    JSON.stringify({ ...params, cookieBirth: new Date() / 1000 }),
    // Cookie options
    { maxAge: 900000, httpOnly: true, signed: true, encode }
  ];
};

// Middleware to log requests
export const loggingMiddleware = (
  req: $Request,
  res: $Response,
  next: NextFunction
): void => {
  // Cache current date to variable
  const now = new Date();

  console.log();
  console.log();
  console.log(
    chalk.green.inverse(
      // String containing 7 empty spaces
      Array(7).join(" "),
      "Last request at",
      // Format time output with a padded 0 on < 10 values, separated by :
      [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(time => time.toString(10).padStart(2, "0"))
        .join(":"),
      // String containing 7 empty spaces
      Array(7).join(" ")
    )
  );
  console.log();

  // Display current signed cookies in coonsole, if there are any.
  if (!!req.signedCookies && Object.keys(req.signedCookies).length) {
    console.log("Current signed cookies");
    Object.keys(req.signedCookies).forEach((cookie: string): void => {
      console.log(chalk.bold(cookie));
      console.log(JSON.parse(req.signedCookies[cookie]));
    });
    console.log();
  }

  next();
};

// Set up cook parser and logging middleware to apply to every server request
app.use(parseCookies, loggingMiddleware);

// This will be used to login users with username and passwords.
app.post(
  "/login",
  parseCookies,
  parseJson,
  // Exposes an asynchronous request, making await available.
  async (req: $Request, res: $Response): Promise<$Response> => {
    const { body: { name, password } }: Object = req;

    // 404 and send nothing of no password or name were submitted. This
    // is done prior to any logics to avoid running logic on needless junk.
    if (!password || !name) {
      res.status(404);
      return res.send({});
    }

    // Validate by name and password, asynchronously.
    const response = await validateUser({
      name,
      password
    });

    // Set a cookie containing the valid user is
    // there were no errors durning validation.
    if (!response.error) {
      res.cookie(...setCookie("herring", response));
    }

    // Return repsonse.
    return res.send(response);
  }
);

// A backport to log in users and set cookie.
app.use(
  "/connect",
  parseJson,
  async (req: $Request, res: $Response): Object => {
    const { body }: Object = req;

    // Check if connection is from a relevant source.
    if (body && body.data && body.data.token) {
      // Try to fetch user based on token.
      const user = await fromAuthToken(body.data.token);

      // If object with anything is returned, submit user info. Othwesie send null
      return !!Object.keys(user).length ? res.send(user) : res.send(null);
    }

    // Send status 404 and return null of there's no token argument
    res.status(404);
    return res.send(null);
  }
);

// Redirect all requests to / to /graphql.
app.all("/", (req: $Request, res: $Response): $Response =>
  res.redirect("/graphql")
);

// GrpahQL
app.use(
  "/graphql",
  parseCookies,
  GraphqlHTTP(async (req: $Request, res: $Response): Object => {
    type signedCookiesType = { signedCookies: Object | { herring: string } };

    // Get all signed cookies as cookies.
    const { signedCookies: cookies }: signedCookiesType = req;

    // Check if herring cookie exists, if it does,
    // parse it, otherwise currentUserByCookie is null
    const currentUserByCookie: Object | null = cookies && cookies.herring
      ? JSON.parse(cookies.herring)
      : null;

    // If cookie is older than 60 seconds, set cookie again to keep it fresh
    if (
      !!currentUserByCookie &&
      new Date() / 1000 - currentUserByCookie.cookieBirth > 60
    ) {
      res.cookie(...setCookie("herring", currentUserByCookie));
    }

    // A simple helper function to time our requests. Its a higher order function
    // that initiates a timer, and echoes when the returned function is called.
    const timer = hrTimer();

    // Return a graphql response.
    return {
      // The schema describes the structure of the graphql interface.
      schema: Schema,
      // Graphiql is a graphical interface for fetching and playing with the schema
      graphiql: true,
      // Pretty print output
      pretty: false,
      // Context is passed through on every request and acessible to resolvers.
      context: {
        // Create dataloaders and pass current viewer down to
        // loaders. Loaders will be used to fetch data uppon request.
        loaders: createLoaders(currentUserByCookie),
        // Pass the fully hydrated viewer object down through the context
        viewer: currentUserByCookie
      },
      // Extensions are optional extra attributes fetched on request
      extensions() {
        // Ends the timer and returns it pretty printed
        return { timeTaken: timer().prettyPrint };
      }
    };
  })
);

// Give a friendly message that the app us up and running.
const server: $Application = app.listen(APP_PORT, (): void => {
  // Function that printso ut the address, neatly formatted.
  const address = (port: string, route = ""): string =>
    chalk.magenta.bold.italic(`${APP_PROTOCOL}://${APP_HOST}:${port}/${route}`);

  // Inform about server status.
  console.log(
    chalk.blue(`Server instance is running at ${address(APP_PORT)}
If you launched the frontend, it's proxied to ${address(APP_FRONT_PORT, "api")}

${chalk.bold(
      `To access the graphical user interface, go to ${address(APP_FRONT_PORT)}`
    )}`)
  );
});

// Export server, this helps with testing.
export default server;
