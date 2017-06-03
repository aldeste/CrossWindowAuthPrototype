// @flow

// this is a gateway file. It'll only require the opening file for the
// specified environment. The benefit here is that the development version
// will be entierly removed in productin since process.env.NODE_ENV will
// be parsed to false, hence it'll be removed in a dead-code-removal step.
if (process.env.NODE_ENV === "production") {
  module.exports = require("./Root.prod");
} else {
  module.exports = require("./Root.dev");
}
