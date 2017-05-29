# AuthJazz
This is a multi-auth plugin system. The purpose is to make it possible to log in users on a plural amount of auth systems with a single login.

## Running the application
`yarn start` starts a backend port and two frontend ports. One of the frontends purpose is to be an iframe wrapped component within the other.
Navigate to `localhost:4000` to visualize the graphical user interface.

The backend uses GraphQL as a query language. GraphiQL is accessible from `localhost:2000` or `localhost:4000/api/graphql`.

Every request to the server will log a notice in the terminal stating the time the request issued and fetches done to the server.

## Development

 * Use Prettier to style everything.
 * Jest for testing. Supertest available to test server, and testcheck bindings for jest available to autogenerate mass mock data for testing.
 * Flow for type checking.
 * Any frontend managed with React.
 * Node Express, Sequelize and GraphQL backend.

### Testing
We use Jest for testing. Jest is a low configuration full bundle test framework. Run tests with `yarn test`. To get a code coverage report, run `yarn test:cov`.  
`yarn test -- --watch` keeps jest running.

To check types, run `yarn flow`. This will launch a Flow server and check all types in *.js files marked with `// @flow` on line one.

Have fun with it.
