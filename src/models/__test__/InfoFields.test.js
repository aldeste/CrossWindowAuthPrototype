import InfoFields from "../InfoFields";

describe("Info fields are always applied to every model", () => {
  it("should contain all required fields", () => {
    const x = new InfoFields({
      id: 1,
      createdAt: "some time",
      updatedAt: "some time",
      GraphQLType: "some type"
    });

    expect(x).toMatchObject({
      id: 1,
      created: "some time",
      edited: "some time",
      GraphQLType: "some type"
    });
  });
});
