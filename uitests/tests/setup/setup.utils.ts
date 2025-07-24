import { Token } from "../types/Authorization";

interface Storage {
  name: string;
  value: string;
}

interface Origin {
  origin: string;
  localStorage: Storage[];
}

export interface ContextState {
  cookies: object[];
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
