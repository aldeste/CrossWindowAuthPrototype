// @flow
import { injectGlobal } from "styled-components";

// A function to inject global CSS styles, giving me the power of CSS-in-JS.
export default () => injectGlobal`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  *::after, *::before {
    box-sizing: inherit;
  }`;
