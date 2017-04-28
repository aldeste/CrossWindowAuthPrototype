// @flow
import styled from "styled-components";
import View from "./View";

const Wrapper = styled(View)`
  margin-left: 5rem;
  margin-right: 5rem;
  margin-top: 2rem;

  > * + * {
    margin-top: 2rem;
  }
`;

export default Wrapper;
