// @flow
import styled from "styled-components";

const Form = styled.form`
  margin-top: 1rem;
  display: flex;
  ${({ horizontal }: { horizontal: ?string }) => (!!horizontal ? `
    flex-flow: row wrap;
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

    *:not(*:first-of-type), button {
      margin-top: 1rem;
    }
  ` : `
    flex-flow: column;

    *:not(label) + * {
      margin-top: 1rem;
    }`)}
`;

export default Form;
