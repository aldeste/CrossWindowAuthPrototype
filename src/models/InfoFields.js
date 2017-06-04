// @flow
import { type InfoFieldFromDatabase } from "../data/models";

export type InfoFieldTypes = {
  created: Date,
  edited: Date,
  id: string,
  GraphQLType: string
};

// A base class exposing common fields available in each model.
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
