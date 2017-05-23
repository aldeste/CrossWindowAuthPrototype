// @flow
import { type DataLoaders } from "../schema/apiHelper";

export type Viewer = {
  birthYear: string,
  created: Date,
  edited: Date,
  eyeColor: string,
  gender: string,
  hairColor: string,
  height: number,
  id: string,
  mass: number,
  name: string,
  homeworld: string,
  personId?: ?number,
  skinColor: string,
  token: string,
  GraphQLType: string
};

type PersonModel = Viewer & {
  createdAt: Date,
  updatedAt: Date,
  homeworld: {
    id: number
  }
};

export default class UserServieLayer {
  birthYear: string;
  created: Date;
  edited: Date;
  eyeColor: string;
  gender: string;
  hairColor: string;
  height: number;
  id: string;
  mass: number;
  name: string;
  skinColor: string;
  token: string;
  GraphQLType: string;
  homeworld: number;

  constructor(data: PersonModel) {
    this.birthYear = data.birthYear;
    this.created = data.createdAt;
    this.edited = data.updatedAt;
    this.eyeColor = data.eyeColor;
    this.gender = data.gender;
    this.hairColor = data.hairColor;
    this.height = data.height;
    this.id = data.id;
    this.mass = data.mass;
    this.name = data.name;
    this.skinColor = data.skinColor;
    this.token = data.token;
    this.homeworld = data.homeworld.id;
    this.GraphQLType = data.GraphQLType;
  }

  static async gen(
    viewer: ?Viewer,
    id: string,
    { Person }: DataLoaders
  ): Promise<?UserServieLayer> {
    const data: PersonModel | null = await Person.load(id);
    return data ? new UserServieLayer(data) : null;
  }

  static async genMany(
    viewer: ?Viewer,
    { Person }: DataLoaders,
    connection: Class<*>,
    ids: Array<string>
  ): Promise<?Array<UserServieLayer>> {
    const data: Array<PersonModel> | null = await connection.findAll({
      where: { id: [ids] }
    });

    // return imideately if failed to fetch
    if (!data) return null;

    // We put each field in the dataloader cache
    await data.forEach(result => Person.prime(result.id, result));

    return await data.map(result => new UserServieLayer(result));
  }
}
