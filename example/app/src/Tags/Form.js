// @flow
import styled, { css } from "styled-components";

type Props = {
  horizontal: ?string
};

// CSS written with the power of javascript using styled components
const Form = styled.form`
  margin-top: 1rem;
  display: flex;
  flex-flow: ${({ horizontal }: Props) =>
    !!horizontal ? "row wrap;" : "column;"}
  ${({ horizontal }: Props) =>
    !!horizontal
      ? css`
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
    `
      : css`
    *:not(label) + * {
      margin-top: 1rem;
    }`}
`;

export default Form;
