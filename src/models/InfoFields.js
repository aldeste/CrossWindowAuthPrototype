// @flow
export type InfoFieldTypes = {
  created: Date,
  edited: Date,
  id: string,
  GraphQLType: string
};

export type InfoFieldFromDatabase = {
  createdAt: Date,
  updatedAt: Date,
  id: string,
  GraphQLType: string
};

export default class InfoFields {
  created: Date;
  edited: Date;
  GraphQLType: string;
  id: string;

  constructor(data: InfoFieldFromDatabase) {
    this.created = data.createdAt;
    this.edited = data.updatedAt;
    this.GraphQLType = data.GraphQLType;
    this.id = data.id;
  }
}
