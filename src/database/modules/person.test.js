import Person from "./Person";

describe("Person", () => {
  // const attributes = Object.keys(Person.attributes);
  it("Should contain a password field", () =>
    expect(Person.attributes.password).toBeDefined());
  it("Should not be able to have an empty password", () =>
    expect(Person.attributes.password.allowNull).toBe(false));
  it("Should contain a name field", () =>
    expect(Person.attributes.password).toBeDefined());
  it("Should not be able to have an empty name", () =>
    expect(Person.attributes.name.allowNull).toBe(false));
});
