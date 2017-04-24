import connection, { Person, Planet } from "./";

describe("Modules are defined", () => {
  Promise.all(
    [Person, Planet].map(module =>
      it("Returns module " + module, () => expect(module).toBeDefined())
    )
  );
});

describe("Connection goes through settup", () => {
  it("Passes connection", () => expect(connection).toBeDefined());
});

// describe("Dummy is inserted", () => it("calls dummy once", () => {
//   jest.mock('./dummy/', () => jest.fn().mockImplementation(() => 42)); // this happens automatically with automocking
//   const dummy = require('./dummy/');
//   expect(dummy).toHaveBeenCalled()
// }))
