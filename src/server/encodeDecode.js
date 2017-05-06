// @flow
/**
 * We don't need anything fancy for this demo.
 * Base64 will do, even though it's not safe at all.
 * By wrapping it in its own interface we enable
 * ourselves to easily change it later.
 */

/**
 * This is an encoding function.
 */
export function encode(msg: string, salt?: string): string {
  if (typeof msg !== "string") {
    throw new Error(`Encode expects a string, ${msg} is a ${typeof msg}`);
  }
  const encoded = new Buffer(msg).toString("base64");
  if (typeof salt === "string") {
    return salt + encoded;
  }
  return encoded;
}

/**
 * Decode the encoded message.
 */
export function decode(msg: string, salt?: string): string {
  const decoded = new Buffer(msg, "base64").toString();

  if (typeof salt === "string") {
    return decoded.substring(salt.length - 1);
  }
  return decoded;
}
