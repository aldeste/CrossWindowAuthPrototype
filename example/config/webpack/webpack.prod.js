const { join } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const PrepackWebpackPlugin = require("prepack-webpack-plugin").default;
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
const WebpackChunkHash = require("webpack-chunk-hash");
const CompressionPlugin = require("compression-webpack-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const FRONTEND = "example/app/src";
const PUBLIC = "example/app/public";

module.exports = {
  entry: {
    app: join(process.cwd(), `${FRONTEND}/index.js`)
  },
  // Utilize long-term caching by adding content hashes to compiled assets
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "js/[name].[chunkhash].chunk.js"
  },
  devtool: "source-map",
  stats: true,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    // Place vendors in own file, better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
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
    // Minify output
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new PrepackWebpackPlugin(),
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
      // Sets theme color, for PWA
      themeColor: "#03bf83",
      title: "AuthJazz",
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
    // Generate chunk manifest, used for caching.
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new WebpackChunkHash(),
    new ChunkManifestPlugin({
      inlineManifest: true
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|html)$/,
      minRatio: 0.8
    }),
    new SWPrecacheWebpackPlugin(),
    new BundleAnalyzerPlugin({ openAnalyzer: true, analyzerMode: "static" })
  ]
};
