import Planet from "./planet";
import planetType from "../../schema/types/planetType";

describe("Planet", () => {
  it("Should contain a name field", () =>
    expect(Planet.attributes.name).toBeDefined());

  it("Should not be able to have an empty name", () =>
    expect(Planet.attributes.name.allowNull).toBe(false));

  it("Should contain an climates field", () =>
    expect(Planet.attributes.climates).toBeDefined());

  it("Should contain an diameter field", () =>
    expect(Planet.attributes.diameter).toBeDefined());

  it("Should contain an gravity field", () =>
    expect(Planet.attributes.gravity).toBeDefined());

  it("Should contain an orbitalPeriod field", () =>
    expect(Planet.attributes.orbitalPeriod).toBeDefined());

  it("Should contain an population field", () =>
    expect(Planet.attributes.population).toBeDefined());

  it("Should contain an rotationPeriod field", () =>
    expect(Planet.attributes.rotationPeriod).toBeDefined());

  it("Should contain an surfaceWater field", () =>
    expect(Planet.attributes.surfaceWater).toBeDefined());

  it("Should contain an terrains field", () =>
    expect(Planet.attributes.terrains).toBeDefined());
});

describe("Planet should have a graphql type", () => {
  it("Should contain a GraphQLType field", () =>
    expect(Planet.attributes.GraphQLType).toBeDefined());

  it("Should contain the correct GraphQLType", () =>
    expect(Planet.attributes.GraphQLType.get()).toBe(planetType.name));
});
