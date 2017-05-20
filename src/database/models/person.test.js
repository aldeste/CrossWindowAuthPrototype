import Person from "./person";
import personType from "../../schema/types/personType";

describe("Person", () => {
  it("Should contain a password field", () =>
    expect(Person.attributes.password).toBeDefined());
  it("Should not be able to have an empty password", () =>
    expect(Person.attributes.password.allowNull).toBe(false));
  it("Should contain a name field", () =>
    expect(Person.attributes.name).toBeDefined());
  it("Should not be able to have an empty name", () =>
    expect(Person.attributes.name.allowNull).toBe(false));
  it("Should contain a token field", () =>
    expect(Person.attributes.token).toBeDefined());
  it("Should not be able to have an empty token", () =>
    expect(Person.attributes.token.allowNull).toBe(false));
});

describe("Person should have a graphql type", () => {
  it("Should contain a GraphQLType field", () =>
    expect(Person.attributes.GraphQLType).toBeDefined());
  it("Should contain the correct GraphQLType", () =>
    expect(Person.attributes.GraphQLType.get()).toBe(personType.name));
});

describe("Person should have extra fields, which will be used later in context if users are authorized", () => {
  it("Should contain an eyeColor field", () =>
    expect(Person.attributes.eyeColor).toBeDefined());

  it("Should be able to have an empty eyeColor", () =>
    expect(Person.attributes.eyeColor.allowNull).toBe(false));

  it("Should contain an birthYear field", () =>
    expect(Person.attributes.birthYear).toBeDefined());

  it("Should be able to have an empty birthYear", () =>
    expect(Person.attributes.birthYear.allowNull).toBe(false));

  it("Should contain an gender field", () =>
    expect(Person.attributes.gender).toBeDefined());

  it("Should contain an hairColor field", () =>
    expect(Person.attributes.hairColor).toBeDefined());

  it("Should contain an height field", () =>
    expect(Person.attributes.height).toBeDefined());

  it("Should contain an mass field", () =>
    expect(Person.attributes.mass).toBeDefined());

  it("Should contain an skinColor field", () =>
    expect(Person.attributes.skinColor).toBeDefined());
});
