import graphql, { ZipToString } from "../Connection";
import { install } from "jasmine-check";
install();

describe("graphql fetches from server", () => {
  it("Returns an object", async () => {
    global.fetch = () =>
      new Promise(resolve =>
        resolve({
          json: () => ({
            data: {
              viewer: { name: "Luke Skywalker" }
            }
          })
        })
      );

    expect(await graphql`{viewer: { name }}`).toMatchObject({
      data: { viewer: { name: "Luke Skywalker" } }
    });
  });
});

describe("ZipToString zips to string correctly", () => {
  check.it("Returns by mergin string to random string", gen.string, x =>
    expect(ZipToString`A ${x}`).toBe(`A ${x}`)
  );

  check.it("Returns by mergin string, random string, string", gen.string, x =>
    expect(ZipToString`A ${x} B`).toBe(`A ${x} B`)
  );

  check.it(
    "Returns by mergin string, random string, string, random string",
    gen.string,
    x => expect(ZipToString`A ${x} B ${x}`).toBe(`A ${x} B ${x}`)
  );

  check.it(
    "Returns by mergin string, random string, random string, string",
    gen.string,
    x => expect(ZipToString`A ${x} ${x} B`).toBe(`A ${x} ${x} B`)
  );

  check.it(
    "Returns by mergin random string, string, random string, string",
    gen.string,
    x => expect(ZipToString`${x} A ${x} B`).toBe(`${x} A ${x} B`)
  );

  check.it(
    "Returns by mergin string, two random strings wtihin, string",
    gen.string,
    x => expect(ZipToString`A ${`${x} ${x}`} B`).toBe(`A ${`${x} ${x}`} B`)
  );

  it("Returns by evaluating any functions", () =>
    expect(ZipToString`A ${() => (true ? "B" : "C")}`).toBe(`A B`));

  check.it(
    "Returns by mergin executed integer multiplications in correct order",
    gen.int,
    x => {
      expect(ZipToString`A ${x + x} B`).toBe(`A ${x + x} B`);
    }
  );
});
