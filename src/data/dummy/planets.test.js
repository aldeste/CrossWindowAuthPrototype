import dummyPlanets from "../../data/dummy/planets.swapi";

const Planet = dummyPlanets[0];

describe("Planet", () => {
  it("Should contain a name field", () => expect(Planet.name).toBeDefined());

  it("Should contain a rotation period field", () =>
    expect(Planet.rotation_period).toBeDefined());

  it("Should contain a orbital period field", () =>
    expect(Planet.orbital_period).toBeDefined());

  it("Should contain a diameter field", () =>
    expect(Planet.diameter).toBeDefined());

  it("Should contain a climate field", () =>
    expect(Planet.climate).toBeDefined());

  it("Should contain a gravity field", () =>
    expect(Planet.gravity).toBeDefined());

  it("Should contain a terrain field", () =>
    expect(Planet.terrain).toBeDefined());

  it("Should contain a surface water field", () =>
    expect(Planet.surface_water).toBeDefined());

  it("Should contain a population field", () =>
    expect(Planet.population).toBeDefined());

  it("Should contain a residents field", () =>
    expect(Planet.residents).toBeDefined());

  it("Should contain a films field", () => expect(Planet.films).toBeDefined());
});

describe("Person dummy data should include some key characters from Star Wars I - VIII for easy testing", () => {
  ["Tatooine", "Alderaan", "Endor", "Naboo"].forEach(name =>
    it("Includes " + name, () =>
      expect(dummyPlanets.find(x => x.name === name)).toBeDefined()
    )
  );
});
