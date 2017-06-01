// @flow

// This is generally the only port to the database needed. There are
// two other ports that are accessed directly in files on use. It's
// using tagged template litterals since this makes for more readable
// GraphQL requests, since GraphQL requests are simple strings.

export default async (gql: Array<string>): Object =>
  await fetch("/api/graphql", {
    method: "POST",
    credentials: "include",
    headers: {
      "Accept-Encoding": "gzip",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/graphql"
    },
    mode: "cors",
    cache: "default",
    body: gql[0]
  }).then(response => response.json());
