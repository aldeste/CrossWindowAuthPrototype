// @flow
import { injectGlobal } from "styled-components";

/*eslint no-unused-expressions: "off"*/
export default () => injectGlobal`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  *::after, *::before {
    box-sizing: inherit;
  }`;
