import * as Tags from "../";
import React from "react";
import renderer from "react-test-renderer";

const AllTags = Object.keys(Tags);

AllTags.forEach(tag => {
  const currentTag = Tags[tag];
  describe(tag + " tag", () => {
    it("Is a react-loadable instance", () => {
      expect(currentTag.name).toBe("Loadable");
    });

    it("Is a react component", () => {
      expect(typeof currentTag).toBe("function");
      expect(<currentTag />.$$typeof.toString()).toBe("Symbol(react.element)");
    });

    it("It resolves asynchronously", async () => {
      const component = renderer.create(React.createElement(currentTag));
      expect(component.toJSON()).toBe(null);
      await new Promise(r => {
        setTimeout(r, 200);
      });
      expect(component.toJSON()).not.toBe(null);
    });
  });
});

describe("Tags index file", () => {
  it("Exports all tags", () => expect(AllTags.length).toBe(9));
  it("Doesn't have a default export", () =>
    expect(Tags.default).toBeUndefined());
});
