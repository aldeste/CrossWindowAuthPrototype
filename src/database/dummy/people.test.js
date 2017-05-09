import dummyPeople from "./people.swapi";

const Person = dummyPeople[0];

describe("Person", () => {
  it("Should contain an id field, which will stand in as a token", () =>
    expect(Person.id).toBeDefined());
  it("Should contain a name field", () => expect(Person.name).toBeDefined());
});

describe("Person should have extra fields, which will be used later in context if users are authorized", () => {
  it("Should contain an eye color field", () =>
    expect(Person.eye_color).toBeDefined());
  it("Should contain a birth year field", () =>
    expect(Person.birth_year).toBeDefined());
});

describe("Person dummy data should include some key characters from Star Wars I - VII for easy testing", () => {
  [
    "Yoda",
    "Darth Vader",
    "Luke Skywalker",
    "Han Solo",
    "Leia Organa",
    "Chewbacca",
    "R2-D2",
    "C-3PO",
    "Rey",
    "BB8"
  ].forEach(name =>
    it("Includes " + name, () =>
      expect(dummyPeople.find(x => x.name === name)).toBeDefined()
    )
  );
});
