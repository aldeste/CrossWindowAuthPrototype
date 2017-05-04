// @flow
import express from "express";
import GraphHTTP from "express-graphql";
import chalk from "chalk";
import bodyParser from "body-parser";

import { APP_PROTOCOL, APP_HOST, APP_PORT } from "../../config/config";
import Schema from "../schema";
import hrTimer from "../utils/hrTimer";
import { validate } from "../authjazz";
import { createLoaders } from "../schema/apiHelper";

import type { $Request, $Response, $Application, Middleware } from "express";

const app: $Application = express();
const jsonParser: Middleware = bodyParser.json();

app.all("/graphql", (req: $Request, res: $Response): $Response =>
  res.redirect("/")
);

// app.use("/connect", jsonParser, (req: Object, res: $Response): $Response => {
//   const timeTaken = hrTimer();
//   const { token }: { token: string } = req.body;
//   const response = {
//     user: validate(token, "", ""),
//     time: timeTaken().prettyPrint
//   };
//
//   if (process.env.NODE_ENV !== "production") {
//     console.log(
//       chalk.blue(`Returned response is ${chalk.bold(response.user)}`)
//     );
//     console.log(chalk.yellow(`This took ${response.time}`));
//   }
//
//   return res.send(JSON.stringify(response));
// });

app.use(
  "/",
  GraphHTTP((req: $Request): Object => {
    console.log(req.query.authToken);
    const timer = hrTimer();
    return {
      schema: Schema,
      graphiql: true,
      pretty: true,
      context: { loaders: createLoaders(), user: "fromAuthToken()" },
      extensions({ document, variables, operationName, result }) {
        return { timeTaken: timer().prettyPrint };
      }
    };
  })
);

const server: $Application = app.listen(APP_PORT, (): void => {
  const address: string = `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}/`;
  console.log(chalk.blue(`App is running at ${chalk.magenta.bold(address)}`));
});

export default server;
