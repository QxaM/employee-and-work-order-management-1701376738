import { APIRequestContext, expect, test } from "@playwright/test";
import path from "path";
import fs from "fs";

import credentials from "../../test-data/credentials.json";
import { AUTHORIZATION_SERVICE_URL, loginApi } from "../utils/api.utils";
import { Credentials, Token } from "../types/Authorization";
import { buildContextStorage, ContextState } from "./setup.utils";

const authFile = path.join(__dirname, "../../test-data/auth/admin.json");

let apiContext: APIRequestContext;

test("Authentication - Admin", async ({ playwright, baseURL }) => {
  // Given
  const userCredentials = credentials.admin as Credentials;
  apiContext = await playwright.request.newContext({
    baseURL: AUTHORIZATION_SERVICE_URL,
  });

  // When
  const token: Token = await loginApi(apiContext, userCredentials);

  // Then
  expect(token).toBeDefined();
  expect(token.token).toBeDefined();

  // Save State
  const contextStorage: ContextState = buildContextStorage(baseURL, token);
  fs.writeFileSync(authFile, JSON.stringify(contextStorage, null, 2));
});
