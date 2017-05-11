// @flow
import styled, { css } from "styled-components";

const Form = styled.form`
  margin-top: 1rem;
  display: flex;
  flex-flow: ${({ horizontal }: { horizontal: ?string }) => (!!horizontal ? "row wrap;" : "column;")}
  ${({ horizontal }: { horizontal: ?string }) => (!!horizontal ? css`
    justify-content: center;
    align-items: center;

    label {
      flex: 1 20%;
    }
    input {
      flex: 1 80%;
    }

    button {
      flex: 1;
    }

    * {
      background: black !important
    }

    *:not(*:first-of-type),
    button {
      margin-top: 1rem;
    }
  ` : css`
    *:not(label) + * {
      margin-top: 1rem;
    }`)}
`;

export default Form;
