import { APIRequestContext } from "@playwright/test";

import { Credentials, Token } from "../types/Authorization";

export const AUTHORIZATION_SERVICE_URL = "http://localhost:8081";

export const loginApi = async (
  apiContext: APIRequestContext,
  credentials: Credentials,
): Promise<Token> => {
  const encodedCredentials = btoa(
    `${credentials.login}:${credentials.password}`,
  );
  const response = await apiContext.post("/login", {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};
