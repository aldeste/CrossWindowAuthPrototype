import styled from "styled-components";

const Button = styled.button`
  padding: .5rem 1rem;
  cursor: pointer;
  transition: background 100ms linear;
  color: white;
  border: 0;
  background: ${props => (!props.alt ? "hsl(161,97%,38%)" : "hsl(289,65%,52%)")};

  &:hover {
    background: ${props => (!props.alt ? `hsl(161,97%,${38 - 5}%)` : `hsl(289,65%,${52 - 5}%)`)};
  }
`;

export default Button;
