import { fromAuthToken, validateUser } from "../auth";

beforeEach(async () => {
  console.log = jest.fn();
  await require("../../data").initializeDatabase();
});

describe("validateUser", () => {
  it("should validate users by username and password", async () => {
    expect(
      await validateUser({ name: "Darth Vader", password: "password" })
    ).toMatchSnapshot();
  });

  it("should throw on password missmatch", async () => {
    const validate = await validateUser({
      name: "Darth Vader",
      password: "passforce"
    });
    expect(() => {
      throw Error(validate.error);
    }).toThrow("Failed to sign in user due to password missmatch");
  });

  it("should throw if no user is found", async () => {
    const validate = await validateUser({
      name: "Darth Skywalker",
      password: "passforce"
    });
    expect(() => {
      throw Error(validate.error);
    }).toThrow("Failed to sign in due to invalid results");
  });
});

describe("fromAuthToken", () => {
  it("should validate users if valid token is requested", async () => {
    expect(await fromAuthToken("UGVyc29uOjQ=")).toMatchSnapshot();
  });

  it("should return empty object if no token is provided", async () => {
    const validate = await fromAuthToken();
    expect(typeof validate).toBe("object");
    expect(Object.keys(validate).length).toBe(0);
  });
});
