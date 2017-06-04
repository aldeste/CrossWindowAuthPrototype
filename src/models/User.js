// @flow
import { type DataLoaders } from "../schema/apiHelper";
import InfoFields, { type InfoFieldTypes } from "./InfoFields";
import { Person as dbPerson } from "../data";
import { type PersonModel } from "../data/models/person";

// Flow type defenition of the viewer object
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

// A class representing a user.
export default class UserInstance extends InfoFields {
  // Flow type defenitions of each method
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

  // Class generator, exposed as a static method. It accepts a
  // viewer object which represents the current browsing user
  // of the website. This allows us to validate user permissions
  // on fetch before results is exposed to the end user.
  static async gen(
    viewer: ?Viewer,
    id: string,
    { Person }: DataLoaders
  ): Promise<?UserInstance> {
    // Get person from DataLoaders
    const data: PersonModel | null = await Person.load(id);
    // Return new instance of this class if fetched, oetherwhise null
    return data ? new UserInstance(data) : null;
  }

  // Generate many. Similar to the single gen
  // method, only this accepts multiple IDs
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

    // return null imideately if failed to fetch
    if (!data || !data.length) return null;

    // We put each field in the dataloader cache
    await data.forEach(result => Person.prime(result.id, result));

    // Return each id as an instance of this class
    return await data.map(result => new UserInstance(result));
  }
}
