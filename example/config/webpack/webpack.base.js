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
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [resolve(process.cwd(), "example/config/babel.js")]
          }
        },
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
      // We don't need CSS files.
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader?modules&importLoaders=1&localIdentName=[emoji]"
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: "file-loader?name=[name].[ext]&limit=10000"
      },
      // We don't need json files
      // {
      //   test: /\.json$/,
      //   use: "json-loader"
      // },
      {
        exclude: [/\.html$/, /\.js$/, /\.css$/, /\.json$/, /\.svg$/],
        loader: "url-loader",
        query: {
          limit: 10000,
          name: "media/[name].[hash:5].[ext]"
        }
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
    hints: "warning",
    assetFilter: file => file.endsWith(".js")
  }
};

module.exports = env =>
  env === "production"
    ? merge.smart(baseSettup, require("./webpack.prod.js"))
    : merge.smart(baseSettup, require("./webpack.dev.js"));
