const dummyData = require("./index");

describe("Dummy data", () => {
  Promise.all(
    Object.keys(dummyData)
      .filter(data => data !== "__esModule")
      .map(data =>
        it("contains dummy data as objects", () =>
          expect(typeof dummyData[data]).toBe("object"))
      )
  );
});
