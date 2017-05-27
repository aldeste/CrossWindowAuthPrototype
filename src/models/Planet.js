// @flow
import { type DataLoaders } from "../schema/apiHelper";
import { type Viewer } from "./User";
import InfoFields, {
  type InfoFieldFromDatabase,
  type InfoFieldTypes
} from "./InfoFields";

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

type PlanetModel = PlanetType & InfoFieldFromDatabase;

export default class PlanetInstance extends InfoFields {
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
  }

  static async gen(
    viewer: ?Viewer,
    id: string,
    { Planet }: DataLoaders
  ): Promise<?PlanetInstance> {
    const data: PlanetModel | null = await Planet.load(id);
    return data ? new PlanetInstance(data) : null;
  }

  static async genMany(
    viewer: ?Viewer,
    { Planet }: DataLoaders,
    connection: Class<*>,
    ids: Array<string>
  ): Promise<?Array<PlanetInstance>> {
    const data: Array<PlanetModel> | null = await connection.findAll({
      where: { id: [ids] }
    });

    // return imideately if failed to fetch
    if (!data) return null;

    // We put each field in the dataloader cache
    await data.forEach(result => Planet.prime(result.id, result));

    return await data.map(result => new PlanetInstance(result));
  }
}
