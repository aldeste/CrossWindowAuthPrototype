// @flow
// Export all sequelize models
import Film from "./film";
import Person from "./person";
import Planet from "./planet";
import Species from "./species";
import Starship from "./starship";
import Vehicle from "./vehicle";

export { Film, Person, Planet, Species, Starship, Vehicle };

// Export standards.
export type InfoFieldFromDatabase = {
  createdAt: Date,
  updatedAt: Date,
  id: string,
  GraphQLType: string
};
