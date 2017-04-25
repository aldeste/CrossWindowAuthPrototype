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
