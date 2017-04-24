// This is a mock file that will replace the output of css import files.
// http://facebook.github.io/jest/docs/tutorial-webpack.html

module.exports = {
  process() {
    return "module.exports = {};";
  },
  getCacheKey() {
    return "css";
  }
};
