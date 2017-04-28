// @flow
import styled from "styled-components";

const Button = styled.button`
  padding: .5rem 1rem;
  transition: background 100ms linear;
  color: white;
  border: 0;
  background: ${({ alternative }: { alternative: boolean }) => (!alternative ? "hsl(161,97%,38%)" : "hsl(289,65%,52%)")};

  &:hover {
    background: ${({ alternative }: { alternative: boolean }) => (!alternative ? `hsl(161,97%,${38 - 5}%)` : `hsl(289,65%,${52 - 5}%)`)};
  }

  &:disabled {
    background: ${({ alternative }: { alternative: boolean }) => (!alternative ? `hsl(161,${97 - 40}%,38%)` : `hsl(289,${65 - 40}%,52%)`)};
  }

  &:not(:disabled) {
    cursor: pointer;
  }
`;

export default Button;
