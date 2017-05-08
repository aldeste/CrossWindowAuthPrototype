import dummyPeople from "./people";

const Person = dummyPeople[0].node;

describe("Person", () => {
  it("Should contain an id field, which will stand in as a token", () =>
    expect(Person.id).toBeDefined());
  it("Should contain a name field", () => expect(Person.name).toBeDefined());
});

describe("Person should have extra fields, which will be used later in context if users are authorized", () => {
  it("Should contain an eyeColor field", () =>
    expect(Person.eyeColor).toBeDefined());
  it("Should contain an birthYear field", () =>
    expect(Person.birthYear).toBeDefined());
});
describe("Person dummy data should include some key characters from Star Wars IV - VI for easy testing", () => {
  [
    "Yoda",
    "Darth Vader",
    "Luke Skywalker",
    "Han Solo",
    "Leia Organa",
    "Chewbacca",
    "R2-D2",
    "C-3PO"
  ].forEach(name =>
    it("Includes " + name, () =>
      expect(dummyPeople.find(x => x.node.name === name)).toBeDefined()
    )
  );
});
