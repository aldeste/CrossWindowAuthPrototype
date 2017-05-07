import * as Tags from "./";
import React from "react";

const AllTags = Object.keys(Tags);

AllTags.forEach(tag => {
  const currentTag = Tags[tag];
  describe(tag + " tag", () => {
    it("Is a styled component", () => {
      expect(currentTag.name).toBe("StyledComponent");
    });

    it("Is a react component", () => {
      expect(typeof currentTag).toBe("function");
      expect(<currentTag />.$$typeof.toString()).toBe("Symbol(react.element)");
    });
  });
});

describe("Tags index file", () => {
  it("Exports all tags", () => expect(AllTags.length).toBe(8));
  it("Doesn't have a default export", () =>
    expect(Tags.default).toBeUndefined());
});
