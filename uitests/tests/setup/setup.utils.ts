import { Token } from "../types/Authorization";

interface Storage {
  name: string;
  value: string;
}

interface Origin {
  origin: string;
  localStorage: Storage[];
}

interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
}

export interface ContextState {
  cookies: Cookie[];
  origins: Origin[];
}

export const buildContextStorage = (
  baseUrl: string | undefined,
  token: Token,
): ContextState => {
  return {
    cookies: [],
    origins: [
      {
        origin: baseUrl ?? "http://localhost:8080",
        localStorage: [
          {
            name: "token",
            value: token.token,
          },
        ],
      },
    ],
  };
};
