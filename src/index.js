// Enable modern javascript using babel.
require("babel-register");

// Load env variables from .env file if exists in root, otherwise fail
// silently. .env variables never overide set variables from terminal, they're
// all still overridable. Make sure to include fallbacks for every env variable
// that are essential for opperation. https://github.com/motdotla/dotenv
require("dotenv").config({ silent: true });

// Require the entry to our application.
require("./server/main");
