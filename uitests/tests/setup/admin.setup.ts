import { APIRequestContext, expect, test } from "@playwright/test";
import path from "path";
import fs from "fs";

import credentials from "../../test-data/credentials.json";
import { createApiContext, loginApi } from "../utils/authorization.api.utils";
import { Credentials, Token } from "../types/Authorization";
import { buildContextStorage, ContextState } from "./setup.utils";

const authDirectory = path.join(__dirname, "../../test-data/auth");
const authFile = path.join(authDirectory, "admin.json");

let apiContext: APIRequestContext;

test("Authentication - Admin", async ({ playwright, baseURL }) => {
  // Given
  const userCredentials = credentials.admin as Credentials;
  apiContext = await createApiContext(playwright);

  // When
  const token: Token = await loginApi(apiContext, userCredentials);

  // Then
  expect(token).toBeDefined();
  expect(token.token).toBeDefined();

  // Save State
  const contextStorage: ContextState = buildContextStorage(baseURL, token);
  fs.mkdirSync(authDirectory, { recursive: true });
  fs.writeFileSync(authFile, JSON.stringify(contextStorage, null, 2));

  await apiContext.dispose();
});
