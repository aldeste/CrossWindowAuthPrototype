// Enable modern javascript using babel, #hardcore
require("babel-register");
// Polyfill all the cool new things. Needed untill babel 7 is released.
require("babel-polyfill");

// Load env variables from .env file if exists in root, otherwise fail
// silently. .env variables never overide set variables from terminal, they're
// all still overridable. Make sure to include fallbacks for every env variable
// that are essential for opperation. https://github.com/motdotla/dotenv
require("dotenv").config({ silent: true });

// Require the entry to our application.
require("./server/main");

// Initialize database
require("./data").initializeDatabase();
