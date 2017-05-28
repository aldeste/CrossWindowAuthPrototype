import {
  getObjectsByType,
  getObjectFromTypeAndId,
  createLoaders
} from "../apiHelper";

import PersonType from "../types/personType";

beforeEach(async () => {
  global.console.log = () => ({});
  await require("../../data").initializeDatabase();
});

describe("getObjectsByType", () => {
  it("Returns a full object", async () => {
    const result = await getObjectsByType(
      PersonType,
      null,
      { loaders: createLoaders(null) },
      [1, 2, 3]
    );

    result.objects.forEach(x => {
      expect(x.created).toBeDefined();
      expect(x.edited).toBeDefined();
      delete x.created;
      delete x.edited;
    });
    expect(result).toMatchSnapshot();
  });

  it("Returns a full object even without loader initialized", async () => {
    const result = await getObjectsByType(PersonType, null, null, [1, 2, 3]);

    result.objects.forEach(x => {
      expect(x.created).toBeDefined();
      expect(x.edited).toBeDefined();
      delete x.created;
      delete x.edited;
    });
    expect(result).toMatchSnapshot();
  });
});

describe("getObjectFromTypeAndId", () => {
  it("Returns one instance", async () => {
    const result = await getObjectFromTypeAndId(PersonType, 2, {
      loaders: createLoaders(null)
    });

    expect(result.created).toBeDefined();
    expect(result.edited).toBeDefined();
    delete result.created;
    delete result.edited;

    expect(result).toMatchSnapshot();
  });

  it("Returns one instance even when loader isn't initialized", async () => {
    const result = await getObjectFromTypeAndId(PersonType, 2, null);

    expect(result.created).toBeDefined();
    expect(result.edited).toBeDefined();
    delete result.created;
    delete result.edited;

    expect(result).toMatchSnapshot();
  });
});

describe("createLoaders", () => {
  it("Creates Planet loader", async () => {
    const loaders = createLoaders();
    const result = await loaders.Planet(3);
    expect(result.created).toBeDefined();
    expect(result.edited).toBeDefined();
    delete result.created;
    delete result.edited;

    expect(result).toMatchSnapshot();
  });

  it("Creates Person loader", async () => {
    const loaders = createLoaders();
    const result = await loaders.Person(3);
    expect(result.created).toBeDefined();
    expect(result.edited).toBeDefined();
    delete result.created;
    delete result.edited;

    expect(result).toMatchSnapshot();
  });
});
