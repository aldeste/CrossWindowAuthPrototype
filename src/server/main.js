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

import type {
  $Request,
  $Response,
  $Application,
  Middleware,
  NextFunction
} from "express";

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

// Log to console on every request
app.use(
  parseCookies,
  (req: $Request, res: $Response, next: NextFunction): void => {
    // Display current date, to keep track of updates
    const now = new Date();
    console.log();
    console.log();
    console.log(
      chalk.green.inverse(
        Array(7).join(" "),
        "Last request at",
        [
          now.getHours().toString(10).padStart(2, "0"),
          now.getMinutes().toString(10).padStart(2, "0"),
          now.getSeconds().toString(10).padStart(2, "0")
        ].join(":"),
        Array(7).join(" ")
      )
    );
    console.log();

    // Display current cookies in coonsole, if there are any
    if (Object.keys(req.signedCookies).length) {
      console.log("Current signed cookies");
      Object.keys(req.signedCookies).forEach((cookie: string): void => {
        console.log(chalk.bold(cookie));
        console.log(JSON.parse(req.signedCookies[cookie]));
      });
      console.log();
    }

    next();
  }
);

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

app.use(
  "/connect",
  parseJson,
  async (req: $Request, res: $Response): Object => {
    const { body }: Object = req;

    if (
      (!body && !body.data) ||
      !body.data.key ||
      !body.data.token ||
      body.data.key !== "BOTTLE_OF_WINE"
    ) {
      console.log(chalk.red.bold("THERE BE ERRORS!"));
      console.log(chalk.red.inverse("THIS IS SERIOUSLY SERIOUS!"));
      res.status(404);
      return res.send({});
    }

    const user = await fromAuthToken(body.data.token);
    return user ? res.send(user) : null;
  }
);

app.use("/bridge", parseJson, async (req: $Request, res: $Response): Object => {
  const { body }: Object = req;

  if (
    (!body && !body.data) ||
    !body.data.key ||
    !body.data.token ||
    body.data.key !== "BOTTLE_OF_WINE"
  ) {
    console.log(chalk.red.bold("THERE BE ERRORS!"));
    console.log(chalk.red.inverse("THIS IS SERIOUSLY SERIOUS!"));
    res.status(404);
    return res.send({});
  }

  const user = await fromAuthToken(body.data.token);
  return user ? res.send(user) : null;
});

// Redirect all requests to root to graphql
app.all("/", (req: $Request, res: $Response): $Response =>
  res.redirect("/graphql")
);

app.use(
  "/graphql",
  parseCookies,
  GraphHTTP(async (req: $Request, res: $Response): Object => {
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
  const address: string = `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/`;
  console.log(chalk.blue(`App is running at ${chalk.magenta.bold(address)}`));
});

// Export server, this helps with testing.
export default server;
