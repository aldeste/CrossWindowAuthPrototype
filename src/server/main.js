// @flow
import express from "express";
import GraphHTTP from "express-graphql";
import chalk from "chalk";

import { APP_PROTOCOL, APP_HOST, APP_PORT } from "../../config/config";
// import Scheme from '../schema';
import type { $Request, $Response, $Application } from "express";
import hrTimer from "../utils/hrTimer";

const app: $Application = express();

// Requests to /graphql redirect to /
app.all("/graphql", (req: $Request, res: $Response): $Response =>
  res.redirect("/")
);

app.use(
  "/",
  GraphHTTP((): Object => {
    const timer = hrTimer();
    return {
      schema: "Schema",
      graphiql: true,
      pretty: true,
      context: { loaders: "createLoaders()" },
      extensions({ document, variables, operationName, result }) {
        return timer();
      }
    };
  })
);

const server: $Application = app.listen(APP_PORT, (): void => {
  const address: string = `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/`;
  console.log(chalk.blue(`App is running at ${chalk.magenta.bold(address)}`));
});

export default server;
