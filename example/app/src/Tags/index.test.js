import * as Tags from "./";
import React from "react";

Object.keys(Tags).forEach(tag => {
  const currentTag = Tags[tag];
  describe(tag + " tag", () => {
    it("Is a react component", () => {
      expect(typeof currentTag).toBe("function");
      expect(<currentTag />.$$typeof.toString()).toBe("Symbol(react.element)");
    });
  });
});
