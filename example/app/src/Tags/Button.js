// @flow
import styled from "styled-components";

type Props = { outlined: boolean, alternative: boolean };

const Button = styled.button`
  background-color: ${({ alternative, outlined }: Props) => (outlined ? "transparent" : !alternative ? "hsl(161,97%,38%)" : "hsl(290,80%,44%)")};
  border: ${({ alternative, outlined }: Props) => (outlined ? `3px solid ${!alternative ? "hsl(161,97%,38%)" : "hsl(290,80%,44%)"}` : 0)};
  color: ${({ outlined }: Props) => (outlined ? "inherit" : "white")};
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  padding: ${({ outlined }: Props) => (outlined ? "calc(0.5rem - 3px) calc(1rem - 3px)" : "0.5rem 1rem")};
  transition: background 100ms linear;

  &:hover {
    background-color: ${({ alternative, outlined }: Props) => (outlined ? "transparent" : !alternative ? `hsl(161,97%,${38 - 5}%)` : `hsl(290,80%,${44 - 5}%)`)};
    border: ${({ alternative, outlined }: Props) => (outlined ? `3px solid ${!alternative ? `hsl(161,97%,${38 - 5}%)` : `hsl(290,80%,${44 - 5}%)`}` : 0)};
  }

  &:disabled {
    background-color: ${({ alternative, outlined }: Props) => (outlined ? "transparent" : !alternative ? `hsl(161,${97 - 40}%,${38 - 5}%)` : `hsl(290,${80 - 40}%,${44 - 5}%)`)};
    border: ${({ alternative, outlined }: Props) => (outlined ? `3px solid ${!alternative ? `hsl(161,${97 - 40}%,${38 - 5}%)` : `hsl(290,${80 - 40}%,${44 - 5}%)`}` : 0)};
  }

  &:not(:disabled) {
    cursor: pointer;
  }
`;

export default Button;
