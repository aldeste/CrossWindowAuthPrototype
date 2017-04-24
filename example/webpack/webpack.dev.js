const { join } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { APP_PORT, APP_HOST } = require("../config");

const sharedCache = {};

module.exports = {
  cache: sharedCache,
  entry: [
    "react-hot-loader/patch",
    // `webpack-dev-server/client?http://${APP_HOST}:${APP_PORT}`,
    // "webpack/hot/only-dev-server",
    "webpack-hot-middleware/client?reload=true",
    join(process.cwd(), "src/index.js")
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
      template: join(process.cwd(), "src/index.html")
    })
  ]
  // devServer: {
  //   publicPath: "/",
  //   hot: true,
  //   inline: true,
  //   host: APP_HOST,
  //   port: APP_PORT,
  //   // Serve gzipped versions of everything for better
  //   // bottleneck troubleshooting
  //   compress: true,
  //   // Ignore node_modules, as this can cause memory issues on some machines
  //   watchOptions: { ignored: /node_modules/ },
  //   // This all requests will be sent to index.html, as we're using a
  //   // history API based router.
  //   historyApiFallback: true,
  //   contentBase: join(process.cwd(), "build"),
  //   stats: "errors-only",
  //   overlay: { errors: true, warnings: false }
  // }
};
