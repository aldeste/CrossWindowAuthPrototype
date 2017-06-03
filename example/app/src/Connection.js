// @flow

// This zips a tagget template litteral (used underneath) into a
// single string. The main advantage gained by using this API is that
// every template interpolation is returned as a new argument to the
// function, making them directly loopable. This makes it possible to
// execute strings and handle the string using our own custom logic.
const ZipToString = (
  template: Array<string>,
  ...argsArray: Array<string | Function | number>
): string => {
  const args = argsArray.map(arg => {
    if (typeof arg === "function") {
      return arg();
    }

    if (typeof arg === "number") {
      return arg.toString();
    }

    return arg;
  });

  return template.reduce((prev, curr, i) => prev + curr + (args[i] || ""), "");
};

// This is generally the only port to the database needed. There are
// two other ports that are accessed directly in files on use. It's
// using tagged template litterals since this makes for more readable
// GraphQL requests, since GraphQL requests are simple strings.
export default async (
  template: Array<string>,
  ...args: Array<string>
): Object =>
  await fetch("/api/graphql", {
    method: "POST",
    credentials: "include",
    headers: {
      // Every response is returned gziped, for maximum awesomeability
      "Accept-Encoding": "gzip",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/graphql"
    },
    mode: "cors",
    cache: "default",
    body: ZipToString(template, ...args)
  }).then(response => response.json());

export { ZipToString };
