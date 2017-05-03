const { join } = require("path");
const webpack = require("webpack");
// const ManifestPlugin = require("webpack-manifest-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const FRONTEND = "example/app/src";
const PUBLIC = "example/app/public";

module.exports = {
  entry: {
    app: join(process.cwd(), `${FRONTEND}/index.js`)
  },
  // Utilize long-term caching by adding content hashes to compiled assets
  output: {
    filename: "[name].[chunkhash:5].js",
    chunkFilename: "js/[name].[chunkhash:5].chunk.js"
  },
  devtool: "source-map",
  stats: true,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // Prune Moment for unused locales. If you add more locales,
    // make sure you change sv to sv|othrlocale and so forth.
    // new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(sv)$/),
    // Place vendors in own file, better caching
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor",
    //   minChunks: module =>
    //     module.context && module.context.indexOf("node_modules") !== -1
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      // minChunks: module =>
      //   module.context && module.context.indexOf("node_modules") !== -1
      minChunks: (module, count) =>
        module.resource && /node_modules/.test(module.resource)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: true,
      children: true,
      name: "commonlazy"
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   children: true,
    //   minChunks: 2
    // }),
    // Minify output
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    // Generate minified and optimized index.html from template
    new HtmlWebpackPlugin({
      template: join(process.cwd(), `${PUBLIC}/index.html`),
      inject: true,
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    // new ManifestPlugin({
    //   fileName: "manifest.json"
    // }),
    new BundleAnalyzerPlugin({ openAnalyzer: true })
  ]
};
