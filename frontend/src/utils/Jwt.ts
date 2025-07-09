import { base64UrlDecode } from './Base64.ts';
import { JWT } from '../types/AuthorizationTypes.ts';

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
