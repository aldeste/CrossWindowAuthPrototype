// @flow
import { type DataLoaders } from "../schema/apiHelper";
import { type Viewer } from "./User";
import InfoFields, { type InfoFieldTypes } from "./InfoFields";
import { Planet as dbPlanet } from "../data";
import { type PlanetModel } from "../data/models/planet";

// Flow type defenition of the planet type
export type PlanetType = InfoFieldTypes & {
  climates: string,
  diameter: number,
  gravity: string,
  name: string,
  orbitalPeriod: number,
  population: number,
  residents: Array<string>,
  rotationPeriod: number,
  surfaceWater: number,
  terrains: string
};

// A class representing a planet.
export default class PlanetInstance extends InfoFields {
  // Flow type defenitions of each method
  climates: string;
  diameter: number;
  gravity: string;
  name: string;
  orbitalPeriod: number;
  population: number;
  residents: Array<string>;
  rotationPeriod: number;
  surfaceWater: number;
  terrains: string;

  constructor(data: PlanetModel) {
    super(data);
    this.climates = data.climates;
    this.diameter = data.diameter;
    this.gravity = data.gravity;
    this.name = data.name;
    this.orbitalPeriod = data.orbitalPeriod;
    this.population = data.population;
    this.rotationPeriod = data.rotationPeriod;
    this.surfaceWater = data.surfaceWater;
    this.terrains = data.terrains;
    this.residents = data.residents.reduce((pre, { id }) => [...pre, id], []);
  }

  // Class generator, exposed as a static method. It accepts a
  // viewer object which represents the current browsing user
  // of the website. This allows us to validate user permissions
  // on fetch before results is exposed to the end user.
  static async gen(
    viewer: ?Viewer,
    id: string,
    { Planet }: DataLoaders
  ): Promise<?PlanetInstance> {
    // Get planet from DataLoaders
    const data: PlanetModel | null = await Planet.load(id);
    // Return new instance of this class if fetched, oetherwhise null
    return data ? new PlanetInstance(data) : null;
  }

  // Generate many. Similar to the single gen
  // method, only this accepts multiple IDs
  static async genMany(
    viewer: ?Viewer,
    ids: Array<string>,
    { Planet }: DataLoaders
  ): Promise<?Array<PlanetInstance>> {
    const data: Array<PlanetModel> | null = await dbPlanet
      .scope("withIds")
      .findAll({ where: { id: [ids] } })
      // Only get pure JSON from fetch,
      // Though unlikely, this prevents memory leak.
      .map(response => response.toJSON());

    // return imideately if failed to fetch
    if (!data || !data.length) return null;

    // We put each field in the dataloader cache
    await data.forEach(result => Planet.prime(result.id, result));

    // Return each id as an instance of this class
    return await data.map(result => new PlanetInstance(result));
  }
}
