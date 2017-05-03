// @flow
type Props = {
  children?: string
};

export default ({ children }: Props): null => {
  // Set title if children exists, otherwise leave as is.
  if (typeof children === "string") {
    document.title = children;
  }
  return null;
};
