const { join } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  APP_FRONT_PORT,
  APP_PORT,
  APP_HOST
} = require("../../../config/config");

const FRONTEND = "example/app/src";
const PUBLIC = "example/app/public";

const sharedCache = {};

module.exports = {
  cache: sharedCache,
  entry: [
    "react-hot-loader/patch",
    `webpack-dev-server/client?http://${APP_HOST}:${APP_FRONT_PORT}`,
    "webpack/hot/only-dev-server",
    join(process.cwd(), `${FRONTEND}/index.js`)
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
      template: join(process.cwd(), `${PUBLIC}/index.html`)
    })
  ],
  performance: false,
  devServer: {
    quiet: true,
    publicPath: "/",
    hot: true,
    inline: true,
    host: APP_HOST,
    port: APP_FRONT_PORT,
    proxy: {
      "/api": {
        target: `http://${APP_HOST}:${APP_PORT}`,
        pathRewrite: { "^/api": "" }
      }
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
