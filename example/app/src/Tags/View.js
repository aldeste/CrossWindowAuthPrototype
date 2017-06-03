// @flow
import styled from "styled-components";

// CSS written with the power of javascript using styled components
const View = styled.div`
  align-items: stretch;
  border: 0;
  display: flex;
  flex-flow: column;
  min-height: : 0;
  min-width: 0;

  > * + * {
    margin-top: 0.75em;
  }
`;

export default View;
