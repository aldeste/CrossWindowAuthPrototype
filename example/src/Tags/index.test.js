import * as Tags from "./";
import React from "react";
import renderer from "react-test-renderer";
import { matcher, serializer } from "jest-styled-components";

expect.addSnapshotSerializer(serializer);
expect.extend(matcher);

Object.keys(Tags).forEach(tag => {
  const currentTag = Tags[tag];
  describe(tag + " tag", () => {
    it("Is a react component", () => {
      expect(typeof currentTag).toBe("function");
      expect(<currentTag />.$$typeof.toString()).toBe("Symbol(react.element)");
    });

    it("Is a styled component", () => {
      expect(currentTag.name).toBe("StyledComponent");
    });

    it("Matches earlier configuration", () => {
      expect(renderer.create(<currentTag />)).toMatchStyledComponentsSnapshot();
    });
  });
});
