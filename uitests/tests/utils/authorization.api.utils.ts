import { APIRequestContext } from "@playwright/test";

import { Credentials, Token } from "../types/Authorization";
import { RegisterDetails } from "../authorization/register/register.utils";

export const AUTHORIZATION_SERVICE_URL = "http://localhost:8081";

export const createApiContext = async (
  playwright: typeof import("playwright-core"),
): Promise<APIRequestContext> => {
  return await playwright.request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.ROBOT_TOKEN}`,
    },
  });
};

export const loginApi = async (
  apiContext: APIRequestContext,
  credentials: Credentials,
): Promise<Token> => {
  const encodedCredentials = btoa(
    `${credentials.login}:${credentials.password}`,
  );
  const response = await apiContext.post(AUTHORIZATION_SERVICE_URL + "/login", {
    headers: {
      "X-Basic-Authorization": encodedCredentials,
    },
  });

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

export const registerApi = async (
  apiContext: APIRequestContext,
  registerData: Omit<RegisterDetails, "passwordConfirmation">,
): Promise<void> => {
  const response = await apiContext.post(
    AUTHORIZATION_SERVICE_URL + `/register`,
    {
      data: {
        firstName: registerData.firstName,
        middleName: registerData.middleName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
      },
    },
  );

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const registerConfirmationApi = async (
  apiContext: APIRequestContext,
  token: string,
): Promise<void> => {
  const response = await apiContext.post(
    AUTHORIZATION_SERVICE_URL + `/register/confirm`,
    {
      params: {
        token,
      },
    },
  );

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const passwordResetApi = async (
  apiContext: APIRequestContext,
  email: string,
) => {
  const response = await apiContext.post(
    AUTHORIZATION_SERVICE_URL + "/password/reset",
    {
      params: {
        email,
      },
    },
  );

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const passwordUpdateApi = async (
  apiContext: APIRequestContext,
  newPassword: string,
  token: string,
) => {
  const response = await apiContext.patch(
    AUTHORIZATION_SERVICE_URL + `/password/reset`,
    {
      params: {
        token,
        password: btoa(newPassword),
      },
    },
  );

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const getTokenApi = async (
  apiContext: APIRequestContext,
  email: string,
): Promise<string> => {
  const response = await apiContext.get(
    AUTHORIZATION_SERVICE_URL + `/qa/token`,
    {
      params: {
        email,
      },
    },
  );

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.text();
};

export const expireToken = async (
  apiContext: APIRequestContext,
  token: string,
  expiredDate: Date,
): Promise<void> => {
  const expiredDateJavaLocalDateTimeString = expiredDate
    .toISOString()
    .replaceAll("Z", "");

  const response = await apiContext.patch(
    AUTHORIZATION_SERVICE_URL + `/qa/token/${token}`,
    {
      params: {
        creationDate: expiredDateJavaLocalDateTimeString,
      },
    },
  );

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }
};
