import { expect, test } from "@playwright/test";

import credentials from "../../../test-data/credentials.json";
import { openHomePage } from "../../utils/navigation.utils";
import {
  clickLoginButton,
  login,
  loginError,
  welcomeMessage,
} from "./login.utils";

test("TC1 - should login with valid credentials", async ({ page, baseURL }) => {
  // Given
  const userCredentials = credentials.admin;

  await openHomePage(page);
  await clickLoginButton(page);
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

test("TC2 - should not login with invalid credentials", async ({ page }) => {
  const userCredentials = credentials.admin;

  await openHomePage(page);
  await clickLoginButton(page);

  await test.step(`TC2.1 - should not login with invalid email`, async () => {
    // Given
    const invalidEmail = "invalid@maxq.com";

    // When
    await login(page, invalidEmail, userCredentials.password);

    // Then
    await expect(loginError(page)).toBeVisible();
  });

  await test.step(`TC2.2 - should not login with invalid email`, async () => {
    // Given
    const invalidPassword = "invalid";

    // When
    await login(page, userCredentials.login, invalidPassword);

    // Then
    await expect(loginError(page)).toBeVisible();
  });
});
