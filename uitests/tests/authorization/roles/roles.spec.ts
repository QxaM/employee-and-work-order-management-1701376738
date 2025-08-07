import { expect, test } from "../../base/baseTest";
import { openAdminPage } from "../../utils/navigation.utils";
import { notAuthorizedMessage, notLoggedInMessage } from "./roles.utils";
import { buildContextStorage, ContextState } from "../../setup/setup.utils";

import credentials from "../../../test-data/credentials.json";
import { loginApi } from "../../utils/authorization.api.utils";
import { Page } from "playwright";

test("TC18 - should navigate to login if user is not logged in", async ({
  page,
}) => {
  // Given

  // When
  await openAdminPage(page);

  // Then
  await expect(page).toHaveURL("/login");
  await expect(notLoggedInMessage(page)).toBeVisible();
});

test("TC19 - should navigate to home if user is not authorized", async ({
  browser,
  apiContext,
  baseURL,
}) => {
  let contextState: ContextState;

  await test.step("TC-19.1 - create login state", async () => {
    // Given
    const userCredentials = credentials.operator;

    // When
    const token = await loginApi(apiContext, userCredentials);

    // Then
    expect(token).toBeDefined();
    expect(token.token).toBeDefined();
    contextState = buildContextStorage(baseURL, token);
  });

  let page: Page;
  await test.step("TC-19.2 - navigate to not authorized page", async () => {
    // Given
    page = await browser.newPage({ storageState: contextState });

    // When
    await openAdminPage(page);

    // Then
    await expect(page).toHaveURL("/");
    await expect(notAuthorizedMessage(page)).toBeVisible();
  });
});
