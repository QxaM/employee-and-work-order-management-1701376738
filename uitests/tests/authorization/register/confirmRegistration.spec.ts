import { APIRequestContext, expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";

import { AUTHORIZATION_SERVICE_URL } from "../../utils/api.utils";
import { login, loginError, welcomeMessage } from "../login/login.utils";
import {
  expiredTokenMessage,
  successfullConfirmationMessage,
} from "./register.utils";

let apiContext: APIRequestContext;

test.describe("Confirmation registration tests", () => {
  let email: string;
  let password: string;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: AUTHORIZATION_SERVICE_URL,
    });
  });

  test.beforeEach(async () => {
    email = faker.internet.email();
    password = "test";
    const registerResponse = await apiContext.post(`/register`, {
      data: {
        email,
        password,
      },
    });
    expect(registerResponse.ok()).toBeTruthy();
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("TC6 - cannot log in without confirmation", async ({ page }) => {
    // Given

    // When
    await page.goto("/login");
    await login(page, email, password);

    // Then
    await expect(loginError(page)).toBeVisible();
  });

  test("TC7 - should correctly confirm registration", async ({
    page,
    baseURL,
  }) => {
    await test.step("TC7.1 - should confirm registration", async () => {
      // Given
      const response = await apiContext.get(`/qa/token`, {
        params: {
          email,
        },
      });
      expect(response.ok()).toBeTruthy();
      const token = await response.text();

      // When
      await page.goto(`/register/confirm?token=${token}`);

      // Then
      await Promise.all([
        await expect(page).toHaveURL(baseURL || ""),
        await expect(successfullConfirmationMessage(page)).toBeVisible(),
      ]);
    });

    await test.step("TC7.2 - should login correctly", async () => {
      // Given
      await page.goto("/login");

      // When
      await login(page, email, password);

      // Then
      await Promise.all([
        await expect(loginError(page)).toBeHidden(),
        await expect(page).toHaveURL(baseURL || ""),
        await expect(welcomeMessage(page)).toBeVisible(),
      ]);
    });
  });

  test("TC-8 - should not confirm on expiration", async ({ page, baseURL }) => {
    let token: string;

    await test.step("TC-8.1 - expire token", async () => {
      // Given
      const tokenResponse = await apiContext.get(`/qa/token`, {
        params: {
          email,
        },
      });
      expect(tokenResponse.ok()).toBeTruthy();
      token = await tokenResponse.text();

      const date = new Date();
      const expiredDate = new Date(
        date.setMinutes(date.getMinutes() - 23 * 60 - 1),
      );
      const expiredDateJavaLocalDateTimeString = expiredDate
        .toISOString()
        .replaceAll("Z", "");

      // When
      const expirationResponse = await apiContext.patch(`/qa/token/${token}`, {
        params: {
          creationDate: expiredDateJavaLocalDateTimeString,
        },
      });

      // Then
      expect(expirationResponse.ok()).toBeTruthy();
    });

    await test.step("TC-8.2 - try confirmation with expired token", async () => {
      // Given

      // When
      await page.goto(`/register/confirm?token=${token}`);

      // Then
      await Promise.all([
        await expect(page).toHaveURL(baseURL || ""),
        await expect(expiredTokenMessage(page)).toBeVisible(),
      ]);
    });

    await test.step("TC-8.3 - should not login after unsuccessful confirmation", async () => {
      // Given
      await page.goto("/login");

      // When
      await login(page, email, password);

      // Then
      await expect(loginError(page)).toBeVisible();
    });
  });
});
