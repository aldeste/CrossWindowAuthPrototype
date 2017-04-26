const { resolve } = require("path");
// const webpack = require("webpack");
const merge = require("webpack-merge");

const baseSettup = {
  bail: true,
  output: {
    path: resolve(process.cwd(), "build"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        use: "babel-loader?cacheDirectory",
        exclude: /node_modules/,
        parser: {
          amd: false, // disable AMD
          commonjs: true, // disable CommonJS
          system: false, // disable SystemJS
          harmony: true, // disable ES2015 Harmony import/export
          requireInclude: false, // disable require.include
          requireEnsure: false, // disable require.ensure
          requireContext: false, // disable require.context
          browserify: false, // disable special handling of Browserify bundles
          requireJs: false, // disable requirejs.*
          node: true // disable __dirname, __filename, module, require.extensions, require.main, etc.
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader?modules&importLoaders=1&localIdentName=[emoji]",
          "postcss-loader"
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: "file-loader?name=[name].[ext]&limit=10000"
      },
      {
        exclude: [/\.html$/, /\.js$/, /\.css$/, /\.json$/, /\.svg$/],
        loader: "url-loader",
        query: {
          limit: 10000,
          name: "media/[name].[hash:5].[ext]"
        }
      },
      {
        test: /\.json$/,
        use: "json-loader"
      }
    ]
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx"]
  },
  devtool: "cheap-module-eval-source-map",
  target: "web",
  stats: false,
  performance: {
    maxAssetSize: 100000,
    maxEntrypointSize: 300000,
    hints: "warning"
  }
};

module.exports = env =>
  (env === "production"
    ? merge.smart(baseSettup, require("./webpack.prod.js"))
    : merge.smart(baseSettup, require("./webpack.dev.js")));
