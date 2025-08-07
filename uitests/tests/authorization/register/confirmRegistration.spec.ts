import { APIRequestContext, expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";

import {
  createApiContext,
  expireToken,
  getTokenApi,
  registerApi,
} from "../../utils/authorization.api.utils";
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
    apiContext = await createApiContext(playwright);
  });

  test.beforeEach(async () => {
    email = faker.internet.email();
    password = "test";
    await registerApi(apiContext, { login: email, password });
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
      let token: string | undefined;
      await expect(async () => {
        try {
          token = await getTokenApi(apiContext, email);
        } catch {
          // Empty - retry request
        }
        expect(token).toBeDefined();
      }).toPass();

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
        await expect(welcomeMessage(page, email)).toBeVisible(),
      ]);
    });
  });

  test("TC8 - should not confirm on expiration", async ({ page, baseURL }) => {
    let token: string | undefined;

    await test.step("TC-8.1 - expire token", async () => {
      // Given
      await expect(async () => {
        try {
          token = await getTokenApi(apiContext, email);
        } catch {
          // Empty - retry request
        }
        expect(token).toBeDefined();
      }).toPass();

      const date = new Date();
      const expiredDate = new Date(
        date.setMinutes(date.getMinutes() - 24 * 60 - 1),
      );

      // When + Then
      await expect(
        expireToken(apiContext, token!, expiredDate),
      ).resolves.toBeUndefined();
    });

    await test.step("TC8.2 - try confirmation with expired token", async () => {
      // Given

      // When
      await page.goto(`/register/confirm?token=${token}`);

      // Then
      await Promise.all([
        await expect(page).toHaveURL(baseURL || ""),
        await expect(expiredTokenMessage(page)).toBeVisible(),
      ]);
    });

    await test.step("TC8.3 - should not login after unsuccessful confirmation", async () => {
      // Given
      await page.goto("/login");

      // When
      await login(page, email, password);

      // Then
      await expect(loginError(page)).toBeVisible();
    });
  });
});
