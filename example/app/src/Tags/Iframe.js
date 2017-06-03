// @flow
import styled from "styled-components";

// CSS written with the power of javascript using styled components.
// Using margin calcs to break container
const Iframe = styled.iframe`
  border: 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  filter: invert();
`;

export default Iframe;
