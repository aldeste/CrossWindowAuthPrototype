import Title from "../Title";

describe("Document / Title.js", () => {
  beforeEach(() => {
    global.document = { title: "" };
  });

  it("Sets document title", () => {
    Title({ children: "text" });
    expect(document.title).toBe("text");
  });

  it("Leaves document title alone if chlidren is empty", () => {
    Title({ children: null });
    expect(document.title).toBe("");
  });

  it("Exports a function for easy access", () => {
    expect(typeof Title).toBe("function");
  });
});
