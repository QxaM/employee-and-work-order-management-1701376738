import { expect, test } from "@playwright/test";

import credentials from "../../../test-data/credentials.json";
import { openHomePage } from "../../utils/navigation.utils";
import {
  login,
  loginError,
  openLoginPage,
  welcomeMessage,
} from "./login.utils";

test("TC1 - should login with valid credentials", async ({ page, baseURL }) => {
  // Given
  const userCredentials = credentials.user;

  await openHomePage(page);
  await openLoginPage(page);
  await page.getByText("Enter login details").waitFor({ state: "visible" });

  // When
  await login(page, userCredentials.login, userCredentials.password);

  // Then
  await Promise.all([
    await expect(loginError(page)).toBeHidden(),
    await expect(page).toHaveURL(baseURL || ""),
    await expect(welcomeMessage(page)).toBeVisible(),
  ]);
});
