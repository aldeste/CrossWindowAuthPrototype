// @flow
type Props = {
  children?: string
};

// A function that helps compose document title declaratively
export default ({ children }: Props): null => {
  // Set title if children exists, otherwise leave as is.
  if (typeof children === "string") {
    document.title = children;
  }
  return null;
};
