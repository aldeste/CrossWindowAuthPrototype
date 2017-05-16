import styled from "styled-components";
import View from "./View";

const Wrapper = styled(View)`
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.021em;
  line-height: 1.52947;
  margin: 2rem 5rem;

  > * + * {
    margin-top: 2rem;
  }
`;

export default Wrapper;
