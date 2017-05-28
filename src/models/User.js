// @flow
import { type DataLoaders } from "../schema/apiHelper";
import InfoFields, {
  type InfoFieldFromDatabase,
  type InfoFieldTypes
} from "./InfoFields";
import { Person as dbPerson } from "../data";

export type Viewer = InfoFieldTypes & {
  birthYear: string,
  eyeColor: string,
  gender: string,
  hairColor: string,
  height: number,
  mass: number,
  name: string,
  homeworld: string,
  personId?: ?number,
  skinColor: string,
  token: string
};

type PersonModel = InfoFieldFromDatabase & {
  birthYear: string,
  eyeColor: string,
  gender: string,
  hairColor: string,
  height: number,
  mass: number,
  name: string,
  homeworld: string,
  skinColor: string,
  token: string,
  homeworld: {
    id: number
  }
};

export default class UserInstance extends InfoFields {
  birthYear: string;
  eyeColor: string;
  gender: string;
  hairColor: string;
  height: number;
  mass: number;
  name: string;
  skinColor: string;
  token: string;
  homeworld: number;

  constructor(data: PersonModel) {
    super(data);
    this.birthYear = data.birthYear;
    this.eyeColor = data.eyeColor;
    this.gender = data.gender;
    this.hairColor = data.hairColor;
    this.height = data.height;
    this.mass = data.mass;
    this.name = data.name;
    this.skinColor = data.skinColor;
    this.token = data.token;
    this.homeworld = data.homeworld.id;
  }

  static async gen(
    viewer: ?Viewer,
    id: string,
    { Person }: DataLoaders
  ): Promise<?UserInstance> {
    const data: PersonModel | null = await Person.load(id);
    return data ? new UserInstance(data) : null;
  }

  static async genMany(
    viewer: ?Viewer,
    ids: Array<string>,
    { Person }: DataLoaders
  ): Promise<?Array<UserInstance>> {
    const data: Array<PersonModel> | null = await dbPerson
      .scope("withIds")
      .findAll({ where: { id: [ids] } })
      // Only get pure JSON from fetch,
      // Though unlikely, this prevents memory leak.
      .map(response => response.toJSON());

    // return imideately if failed to fetch
    if (!data) return null;

    // We put each field in the dataloader cache
    await data.forEach(result => Person.prime(result.id, result));

    return await data.map(result => new UserInstance(result));
  }
}
