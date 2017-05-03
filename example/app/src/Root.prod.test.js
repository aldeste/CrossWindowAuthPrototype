jest.mock("react-dom", () => ({ render: () => jest.fn() }));
jest.mock("./App", () => jest.fn());

describe("Root", () => {
  global.document = {
    getElementById: () => ({
      on: () => ({})
    })
  };
  require("./Root.prod");
  it("initiates", done => done());
});
