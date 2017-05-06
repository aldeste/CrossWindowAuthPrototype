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
      res.cookie("herring", JSON.stringify(response), {
        maxAge: 900000,
        httpOnly: true,
        signed: true,
        encode
      });
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

    // Get all signed cookies, then if our herring cookie exists,
    // get user from auth token, otherwise define viewer as empty object.
    const { signedCookies }: signedCookiesType = req;
    const viewer: ViewerType = !!signedCookies && !!signedCookies.herring
      ? await fromAuthToken(JSON.parse(signedCookies.herring).personId)
      : {};

    // Sets cookie again to keep it fresh
    res.cookie(
      "herring",
      JSON.stringify(
        await validateUser({ name: "Yoda", password: "password" })
      ),
      { maxAge: 900000, httpOnly: true, signed: true, encode }
    );
    console.log("signed cookies", req.signedCookies);

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
