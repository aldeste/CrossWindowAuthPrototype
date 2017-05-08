// @flow
import styled from "styled-components";

type Props = { outlined: boolean, alternative: boolean };

const Button = styled.button`
  transition: background 100ms linear;
  color: ${({ outlined }: Props) => (outlined ? "inherit" : "white")};
  border: ${({ alternative, outlined }: Props) => (outlined ? `3px solid ${!alternative ? "hsl(161,97%,38%)" : "hsl(289,65%,52%)"}` : 0)};
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  padding: ${({ outlined }: Props) => (outlined ? "calc(0.5rem - 3px) calc(1rem - 3px)" : "0.5rem 1rem")};
  background-color: ${({ alternative, outlined }: Props) => (outlined ? "transparent" : !alternative ? "hsl(161,97%,38%)" : "hsl(289,65%,52%)")};

  &:hover {
    background-color: ${({ alternative, outlined }: Props) => (outlined ? "transparent" : !alternative ? `hsl(161,97%,${38 - 5}%)` : `hsl(289,65%,${52 - 5}%)`)};
    border: ${({ alternative, outlined }: Props) => (outlined ? `3px solid ${!alternative ? `hsl(161,97%,${38 - 5}%)` : `hsl(289,65%,${52 - 5}%)`}` : 0)};
  }

  &:disabled {
    background-color: ${({ alternative, outlined }: Props) => (outlined ? "transparent" : !alternative ? `hsl(161,${97 - 40}%,${38 - 5}%)` : `hsl(289,${65 - 40}%,${52 - 5}%)`)};
    border: ${({ alternative, outlined }: Props) => (outlined ? `3px solid ${!alternative ? `hsl(161,${97 - 40}%,${38 - 5}%)` : `hsl(289,${65 - 40}%,${52 - 5}%)`}` : 0)};
  }

  &:not(:disabled) {
    cursor: pointer;
  }
`;

export default Button;
