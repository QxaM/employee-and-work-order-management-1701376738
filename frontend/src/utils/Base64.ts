/**
 * Decodes a Base64 URL-encoded string into its original string representation.
 *
 * This function converts a Base64 URL-encoded string, where characters `-` and `_`
 * are used instead of `+` and `/` respectively, back into its original string.
 * It handles potential padding issues by properly adjusting the length of the
 * base64 string before decoding.
 *
 * @param {string | undefined} base64Url - The Base64 URL-encoded string to decode.
 * Could be `undefined`.
 *
 * @returns {string | undefined} The decoded string if the input is valid. Returns `undefined`
 * if the input is `undefined` or if the base64 string has an invalid length.
 */
export const base64UrlDecode = (
  base64Url: string | undefined
): string | undefined => {
  if (base64Url === undefined) {
    return undefined;
  }

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  if (base64.length % 4 === 1) {
    return undefined;
  }

  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
};
