import { base64UrlDecode } from './Base64.ts';
import { JWT } from '../types/AuthorizationTypes.ts';

/**
 * Decodes the payload of a JSON Web Token (JWT).
 *
 * This function extracts and decodes the payload segment of a given JWT string.
 * It handles base64 URL decoding and attempts to parse the resulting payload into a JSON object.
 * If the token is invalid, undefined, or the payload cannot be parsed, it returns undefined.
 *
 * @param {string | undefined} token - The JSON Web Token to parse. If undefined or invalid, the function returns undefined.
 * @returns {JWT | undefined} The decoded payload as a JSON object, or undefined if the token is invalid or parsing fails.
 */
export const parseJwtPayload = (token: string | undefined): JWT | undefined => {
  if (!token) {
    return undefined;
  }

  const payloadBase64 = token.split('.')[1];

  const payload = base64UrlDecode(payloadBase64);

  if (!payload) {
    return undefined;
  }

  let payloadJson: JWT;
  try {
    payloadJson = JSON.parse(payload) as JWT;
  } catch (e) {
    console.error(e);
    return undefined;
  }
  return payloadJson;
};

export const isAdmin = (token: string | undefined): boolean => {
  const payload = parseJwtPayload(token);
  return !!payload && payload.roles.includes('ROLE_ADMIN');
};
