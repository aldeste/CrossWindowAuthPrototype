import User from "../User";
import { Person } from "../../data";
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
    await require("../../data").initializeDatabase();
  });

  it("Returns a class with a valid integer id", async () => {
    const result = await User.gen(null, 3, loaders);
    // Remove created and edited as they're inconsistent
    // after testing if they exist, as they should

    expect(result.created).toBeDefined();
    expect(result.edited).toBeDefined();
    delete result.created;
    delete result.edited;
    expect(result).toMatchSnapshot();
  });

  it("Returns a class with a valid string id", async () => {
    const result = await User.gen(null, "3", loaders);
    // Remove created and edited as they're inconsistent
    // after testing if they exist, as they should

    expect(result.created).toBeDefined();
    expect(result.edited).toBeDefined();
    delete result.created;
    delete result.edited;
    expect(result).toMatchSnapshot();
  });

  it("Returns null if id is invalid", async () => {
    const result = await User.gen(null, "This is an invalid id", loaders);
    expect(result).toBeNull();
  });
});
