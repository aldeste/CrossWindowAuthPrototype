import User from "./User";
import { Person } from "../database";
import DataLoader from "DataLoader";

function getResolve(type, ids) {
  return Promise.all(ids.map(id => type.findById(id)));
}

const loaders = {
  Person: new DataLoader(ids => getResolve(Person, ids))
};

describe("User service layer with connection", () => {
  beforeEach(async () => {
    global.console.log = jest.fn();
    await require("../database").initializeDatabase();
  });

  it("Returns a class with a valid parameter", async () => {
    const result = await User.gen(null, 3, loaders);
    // Remove createdAt and editedAt as they're inconsistent
    // after testing if they exist, as they should
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    delete result.createdAt;
    delete result.updatedAt;
    expect(result).toMatchSnapshot();
  });

  it("Returns null if id is invalid", async () => {
    const result = await User.gen(null, "This is an invalid id", loaders);
    expect(result).toBeNull();
  });
});
