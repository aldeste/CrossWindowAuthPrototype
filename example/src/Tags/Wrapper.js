import styled from "styled-components";
import View from "./View";

const Wrapper = styled(View)`
  margin: 2rem 5rem;
  font-size: 17px;
  line-height: 1.52947;
  font-weight: 400;
  letter-spacing: -0.021em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: #333;

  > * + * {
    margin-top: 2rem;
  }
`;

export default Wrapper;
