// @flow
import "./Document/Styles";
// babel-polyfill will be transformed to required polyfills
import "babel-polyfill";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./Root.prod");
} else {
  module.exports = require("./Root.dev");
}
