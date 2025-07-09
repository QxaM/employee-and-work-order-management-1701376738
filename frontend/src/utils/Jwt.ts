import { base64UrlDecode } from './Base64.ts';

export interface JWT {
  iss: string;
  sub: string;
  exp: number;
  type: string;
  iat: number;
  roles: string[];
}

export const parseJwtPayload = (token: string): JWT | undefined => {
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
