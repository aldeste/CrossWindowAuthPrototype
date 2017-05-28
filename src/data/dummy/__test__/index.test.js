const dummyData = require("../index");

Promise.all(
  Object.keys(dummyData).filter(data => data !== "__esModule").map(data =>
    describe(`Dummy ${data}`, () => {
      it("contains an array", () =>
        expect(typeof dummyData[data]).toBe("object"));

      it("contains atleast one value", () =>
        expect(dummyData[data][0]).toBeDefined());

      it("contains an id", () => expect(dummyData[data][0].id).toBeDefined());
    })
  )
);
