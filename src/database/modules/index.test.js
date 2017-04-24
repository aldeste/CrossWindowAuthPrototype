const modules = require("./index");

describe("Modules", () => {
  Promise.all(
    Object.keys(modules)
      .filter(data => data !== "__esModule")
      .map(data =>
        it("contains modules in " + data, () =>
          expect(modules[data].attributes).toBeDefined()
        )
      )
  );
});
