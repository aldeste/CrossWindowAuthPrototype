import graphql from "../Connection";

global.fetch = () =>
  new Promise(resolve =>
    resolve({
      json: () => ({
        data: {
          viewer: {
            name: "Yoda"
          }
        }
      })
    })
  );

describe("It merges the tagged template litteral", async () => {
  it("fucking rules!", async () => {
    const result = await graphql`{ viewer { name } }`;
    expect(result).toMatchObject({ data: { viewer: { name: "Yoda" } } });
  });
});
