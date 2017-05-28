import Planet from "../Planet";
import User from "../User";
import { Planet as dbPlanet, Person as dbPerson } from "../../data";
import DataLoader from "DataLoader";

function getResolve(type, ids) {
  return Promise.all(ids.map(id => type.scope("withIds").findById(id)));
}

const loaders = {
  Planet: new DataLoader(ids => getResolve(dbPlanet, ids)),
  Person: new DataLoader(ids => getResolve(dbPerson, ids))
};

[User, Planet].map(model =>
  describe(`${model.name} service layer with connection`, () => {
    beforeEach(async () => {
      global.console.log = jest.fn();
      await require("../../data").initializeDatabase();
    });

    it("Returns a class with a valid integer id", async () => {
      const result = await model.gen(null, 3, loaders);
      // Remove created and edited as they're inconsistent
      // after testing if they exist, as they should

      expect(result.created).toBeDefined();
      expect(result.edited).toBeDefined();
      delete result.created;
      delete result.edited;
      expect(result).toMatchSnapshot();
    });

    it("Returns a class with a valid string id", async () => {
      const result = await model.gen(null, "3", loaders);
      // Remove created and edited as they're inconsistent
      // after testing if they exist, as they should

      expect(result.created).toBeDefined();
      expect(result.edited).toBeDefined();
      delete result.created;
      delete result.edited;
      expect(result).toMatchSnapshot();
    });

    it("Returns a class with a valid array of ids", async () => {
      const results = await model.genMany(null, ["1", "2", "3"], loaders);
      // Remove created and edited as they're inconsistent
      // after testing if they exist, as they should

      results.forEach(result => {
        expect(result.created).toBeDefined();
        expect(result.edited).toBeDefined();
        delete result.created;
        delete result.edited;
      });

      expect(results).toMatchSnapshot();
    });

    it("Returns null if id is invalid", async () => {
      const result = await model.gen(null, "This is an invalid id", loaders);
      expect(result).toBeNull();
    });
  })
);
