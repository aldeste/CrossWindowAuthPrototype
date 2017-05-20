import { type DataLoaders } from "../schema/apiHelper";

export type Viewer = {
  birthYear: string,
  created: date,
  edited: date,
  eyeColor: string,
  gender: string,
  hairColor: string,
  height: number,
  id: string,
  mass: number,
  name: string,
  personId?: ?number,
  skinColor: string,
  token: string,
  GraphQLType: string
};

export default class User {
  birthYear: string;
  created: date;
  edited: date;
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

  constructor(data: Viewer) {
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
  ): Promise<?Object> {
    const data: Object | null = await Person.load(id);
    return data ? new User(data) : null;
  }

  static async genMany(
    viewer: ?Viewer,
    { Person }: DataLoaders,
    connection: Class<*>,
    ids: Array<string>
  ): Promise<?Object> {
    const data: Object | null = await connection.findAll({
      where: { id: [ids] }
    });

    await data.forEach(result => Person.prime(result.id, result.dataValues));

    return await data.filter(result => result).map(result => new User(result));
  }
}
