import { createdField, editedField } from "./commonFields";
import { GraphQLString } from "graphql";

[createdField, editedField].map(fun =>
  describe(`All common fields, including ${fun.name}`, () => {
    const funResponse = fun();
    it("is a function", () => {
      expect(typeof fun).toBe("function");
    });

    it("returns an object", () => {
      expect(typeof funResponse).toBe("object");
    });

    it("has a description field", () => {
      expect(funResponse.description).toBeDefined();
    });

    it("has a resolve field", () => {
      expect(funResponse.resolve).toBeDefined();
    });

    it("returns null if resolve fails", () => {
      expect(funResponse.resolve({})).toBeUndefined();
    });

    it("has a type field", () => {
      expect(funResponse.type).toBeDefined();
    });
  })
);

describe("createdField", () => {
  const createdFieldRun = createdField();
  it("resolves correctly", () => {
    expect(createdFieldRun.resolve({ createdAt: "now!" })).toBe("now!");
  });

  it("is of type string", () => {
    expect(createdFieldRun.type).toBe(GraphQLString);
  });
});

describe("editedField", () => {
  const editedFieldRun = editedField();
  it("resolves correctly", () => {
    expect(editedFieldRun.resolve({ editedAt: "now!" })).toBe("now!");
  });

  it("is of type string", () => {
    expect(editedFieldRun.type).toBe(GraphQLString);
  });
});
