const { join } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { APP_PORT, APP_HOST } = require("../../../config/config");

const FRONTEND = "app/src";
const PUBLIC = "app/public";

const sharedCache = {};

module.exports = {
  cache: sharedCache,
  entry: [
    "react-hot-loader/patch",
    `webpack-dev-server/client?http://${APP_HOST}:${APP_PORT * 2}`,
    "webpack/hot/only-dev-server",
    join(process.cwd(), `example/${FRONTEND}/index.js`)
  ],
  output: {
    filename: "[name].js",
    chunkFilename: "[name].js",
    path: join(process.cwd(), "build"),
    devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]",
    publicPath: "/"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: join(process.cwd(), `example/${PUBLIC}/index.html`)
    })
  ],
  devServer: {
    publicPath: "/",
    hot: true,
    inline: true,
    host: APP_HOST,
    port: APP_PORT * 2,
    proxy: {
      "/graphql": `http://${APP_HOST}:${APP_PORT}/graphql`,
      "/connect": `http://${APP_HOST}:${APP_PORT}/connect`
    },
    // Serve gzipped versions of everything for better
    // bottleneck troubleshooting
    compress: true,
    // Ignore node_modules, as this can cause memory issues on some machines
    watchOptions: { ignored: /node_modules/ },
    // This all requests will be sent to index.html, as we're using a
    // history API based router.
    historyApiFallback: true,
    contentBase: join(process.cwd(), "build"),
    stats: "errors-only",
    overlay: { errors: true, warnings: false }
  }
};
