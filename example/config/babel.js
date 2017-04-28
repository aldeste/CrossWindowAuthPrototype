const env = process.env.BABEL_ENV || process.env.NODE_ENV;
const path = require("path");

const plugins = [
  require.resolve("babel-plugin-relay"),
  // Remove flow types
  require.resolve("babel-plugin-transform-flow-strip-types"),
  [
    require.resolve("babel-plugin-styled-components"),
    {
      // Display name of module if we're not in production,
      // Othwehise hash name.
      displayName: env === "development",
      // Remove stylis from runtime, preproccessing css using babel
      preprocess: env === "production"
    }
  ],
  [
    require.resolve("babel-plugin-transform-runtime"),
    {
      helpers: false,
      polyfill: false,
      regenerator: true,
      // Resolve the Babel runtime relative to the config.
      moduleName: path.dirname(require.resolve("babel-runtime/package")),
      useESModules: true,
      useBuiltIns: true
    }
  ]
];

const presets = [
  // Transform JSX to react objects
  require.resolve("babel-preset-react"),
  // We use some stage-2 feautures, might as well include
  // all the way down
  require.resolve("babel-preset-stage-0")
];

if (env === "development" || env === "test") {
  // helps React error message become more firendly and readable
  plugins.push.apply(plugins, [
    // Adds component stack to warning messages
    require.resolve("babel-plugin-transform-react-jsx-source"),
    // Adds __self attribute to JSX which React will use for some warnings
    require.resolve("babel-plugin-transform-react-jsx-self")
  ]);
}

if (env === "test") {
  module.exports = {
    presets: [
      [
        require.resolve("babel-preset-env"),
        {
          targets: {
            node: "current"
          }
        }
      ]
    ].concat(presets),
    plugins: plugins.concat([
      // Compiles import() to a deferred require()
      require.resolve("babel-plugin-dynamic-import-node")
    ])
  };
}

if (env === "development") {
  module.exports = {
    presets: [
      [
        require.resolve("babel-preset-env"),
        {
          targets: { browsers: "last 1 Chrome version, last 1 Safari version" },
          useBuiltIns: true,
          modules: false,
          loose: true,
          useESModules: true
        }
      ]
    ].concat(presets),
    plugins: plugins
  };
}

if (env === "production") {
  module.exports = {
    presets: [
      [
        require.resolve("babel-preset-env"),
        {
          targets: {
            ie: 11
          },
          useBuiltIns: true,
          modules: false,
          loose: true,
          useESModules: true
        }
      ]
    ].concat(presets),
    plugins: plugins
  };
}
