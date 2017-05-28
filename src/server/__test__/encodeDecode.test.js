import { encode, decode } from "../encodeDecode";
import { install } from "jasmine-check";
install();

describe("Encode", () => {
  check.it("encodes a string", gen.string, randomString => {
    // Ignore blankspace string
    if (randomString === "") return;
    expect(encode(randomString)).not.toBe(randomString);
  });

  check.it("encodes a string with salt passed", gen.string, randomString => {
    expect(encode(randomString, "Salt")).not.toBe(randomString);
  });

  check.it("returns a string", gen.string, randomString => {
    expect(typeof encode(randomString)).toBe("string");
  });

  it("throws if value isn't a string", () => {
    expect(() => encode(3)).toThrow("Encode expects a string, 3 is a number");
  });
});

describe("Decode", () => {
  check.it(
    "decodes an encoded string without problems",
    gen.string,
    randomString => {
      expect(decode(encode(randomString))).toBe(randomString);
    }
  );

  check.it("decodes a string with salt passed", gen.string, randomString => {
    expect(decode(encode(randomString, "Salt"), "Salt")).toBe(randomString);
  });

  check.it(
    "doesn't match if salt is only used in encode",
    gen.string,
    randomString => {
      expect(decode(encode(randomString, "Salt"))).not.toBe(randomString);
    }
  );

  check.it(
    "doesn't match if salt is only used in decode",
    gen.string,
    randomString => {
      if (randomString === "") return;
      expect(decode(encode(randomString), "Salt")).not.toBe(randomString);
    }
  );
});
