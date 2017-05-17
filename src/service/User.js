import { type DataLoaders } from "../schema/apiHelper";

export type Viewer = {
  id: number,
  name: string,
  token: string,
  birthYear: number,
  eyeColor: string,
  createdAt: string,
  updatedAt: string,
  GraphQLType: string
};

export default class User {
  id: number;
  name: string;
  token: string;
  birthYear: number;
  eyeColor: string;
  createdAt: string;
  updatedAt: string;
  GraphQLType: string;

  constructor(data: Viewer) {
    this.id = data.id;
    this.name = data.name;
    this.token = data.token;
    this.birthYear = data.birthYear;
    this.eyeColor = data.eyeColor;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
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
}
