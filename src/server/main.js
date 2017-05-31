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

// Middleware to log requests
export const loggingMiddleware = (
  req: $Request,
  res: $Response,
  next: NextFunction
): void => {
  // Display current date, to keep track of updates
  const now = new Date();
  console.log();
  console.log();
  console.log(
    chalk.green.inverse(
      Array(7).join(" "),
      "Last request at",
      [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(time => time.toString(10).padStart(2, "0"))
        .join(":"),
      Array(7).join(" ")
    )
  );
  console.log();

  // Display current cookies in coonsole, if there are any
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

app.use(parseCookies, loggingMiddleware);

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

// Backend handshake to log in users
app.use(
  "/connect",
  parseJson,
  async (req: $Request, res: $Response): Object => {
    const { body }: Object = req;

    // Check if connection is from a relevant source
    if (body && body.data && body.data.token) {
      const user = await fromAuthToken(body.data.token);

      return !!Object.keys(user).length ? res.send(user) : res.send(null);
    }

    res.status(404);
    return res.send(null);
  }
);

// Redirect all requests to root to graphql
app.all("/", (req: $Request, res: $Response): $Response =>
  res.redirect("/graphql")
);

app.use(
  "/graphql",
  parseCookies,
  GraphqlHTTP(async (req: $Request, res: $Response): Object => {
    type signedCookiesType = { signedCookies: Object | { herring: string } };

    // Get all signed cookies, then if our herring cookie exists,
    // get user from auth token, otherwise define viewer as empty object.
    const { signedCookies: cookies }: signedCookiesType = req;

    // Check if herring cookie exists
    const currentUserByCookie: Object | null = cookies && cookies.herring
      ? JSON.parse(cookies.herring)
      : null;

    // If cookie is older than 60 seconds,
    // set cookie again to keep it fresh
    if (
      !!currentUserByCookie &&
      new Date() / 1000 - currentUserByCookie.cookieBirth > 60
    ) {
      res.cookie(...setCookie("herring", currentUserByCookie));
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
        loaders: createLoaders(currentUserByCookie),
        // Pass the fully hydrated viewer object down through the context
        viewer: currentUserByCookie
      },
      extensions() {
        return { timeTaken: timer().prettyPrint };
      }
    };
  })
);

// Ggive a friendly message that the app us up and running
const server: $Application = app.listen(APP_PORT, (): void => {
  const address = (port: string, route = ""): string =>
    chalk.magenta.bold.italic(`${APP_PROTOCOL}://${APP_HOST}:${port}/${route}`);
  console.log(
    chalk.blue(`Server instance is running at ${address(APP_PORT)}
If you've launched the frontend, the API is proxied to ${address(APP_FRONT_PORT, "api")}

${chalk.bold(`To access the graphical user interface, go to ${address(APP_FRONT_PORT)}`)}`)
  );
});

// Export server, this helps with testing.
export default server;
