import { APIRequestContext, expect, test } from "@playwright/test";
import { AUTHORIZATION_SERVICE_URL } from "../../utils/api.utils";
import { faker } from "@faker-js/faker";
import {
  clickResetNow,
  clickResetPassword,
  clickUpdatePassword,
  fillEmail,
  fillPassword,
  fillPasswordConfirmation,
  passwordResetTitle,
  resetPasswordSuccessfullMessage,
  tokenExpiredMessage,
  updatePasswordSuccessfullMessage,
  updatePasswordTitle,
} from "./forgottenPassword.utils";
import {
  openLoginPage,
  openUpdatePasswordPage,
} from "../../utils/navigation.utils";
import { login, loginError, welcomeMessage } from "../login/login.utils";

let email: string;
let password: string;
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: AUTHORIZATION_SERVICE_URL,
  });
});

test.beforeEach(async () => {
  await test.step("Prepare user - register", async () => {
    // Given
    email = faker.internet.email();
    password = "test";

    // When
    const registerResponse = await apiContext.post(`/register`, {
      data: {
        email,
        password,
      },
    });

    // Then
    expect(registerResponse.ok()).toBeTruthy();
  });

  await test.step("Prepare user - confirm registration", async () => {
    // Given
    const response = await apiContext.get(`/qa/token`, {
      params: {
        email,
      },
    });
    expect(response.ok()).toBeTruthy();
    const token = await response.text();

    // When
    const verificationResponse = await apiContext.post(`/register/confirm`, {
      params: {
        token,
      },
    });

    // Then
    expect(verificationResponse.ok()).toBeTruthy();
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test("TC9 - should correctly reset password", async ({ page, baseURL }) => {
  await test.step("TC9.1 - open reset password page", async () => {
    // Given
    await openLoginPage(page);

    // When
    await clickResetNow(page);

    // Then
    await expect(passwordResetTitle(page)).toBeVisible();
  });

  await test.step("TC9.2 - request reset password", async () => {
    // Given

    // When
    await fillEmail(page, email);
    await clickResetPassword(page);

    // Then
    await Promise.all([
      await expect(page).toHaveURL(baseURL || ""),
      await expect(resetPasswordSuccessfullMessage(page)).toBeVisible(),
    ]);
  });

  await test.step("TC9.4 - open reset password page", async () => {
    // Given
    const response = await apiContext.get(`/qa/token`, {
      params: {
        email,
      },
    });
    expect(response.ok()).toBeTruthy();
    const resetPasswordToken = await response.text();

    // When
    await openUpdatePasswordPage(page, resetPasswordToken);

    // Then
    await expect(updatePasswordTitle(page)).toBeVisible();
  });

  let newPassword: string;

  await test.step("TC9.5 - reset password", async () => {
    // Given
    newPassword = faker.internet.password();

    // When
    await fillPassword(page, newPassword);
    await fillPasswordConfirmation(page, newPassword);
    await clickUpdatePassword(page);

    // Then
    await Promise.all([
      await expect(page).toHaveURL(baseURL || ""),
      await expect(updatePasswordSuccessfullMessage(page)).toBeVisible(),
    ]);
  });

  await test.step("TC9.6 - login with new password", async () => {
    // Given
    await openLoginPage(page);

    // When
    await login(page, email, newPassword);

    // Then
    await Promise.all([
      await expect(loginError(page)).toBeHidden(),
      await expect(page).toHaveURL(baseURL || ""),
      await expect(welcomeMessage(page)).toBeVisible(),
    ]);
  });
});

test("TC10 - should not allow to reuse token", async ({ page, baseURL }) => {
  let reusedToken: string;

  await test.step("TC10.1 - request password reset", async () => {
    // Given

    // When
    const response = await apiContext.post("/password/reset", {
      params: {
        email,
      },
    });

    // Then
    expect(response.ok()).toBeTruthy();
  });

  await test.step("TC10.2 - use token for the first time", async () => {
    // Given
    const newPassword = faker.internet.password();
    const tokenResponse = await apiContext.get(`/qa/token`, {
      params: {
        email,
      },
    });
    expect(tokenResponse.ok()).toBeTruthy();
    reusedToken = await tokenResponse.text();

    // When
    const updateResponse = await apiContext.patch(`password/reset`, {
      params: {
        token: reusedToken,
        password: btoa(newPassword),
      },
    });

    // Then
    expect(updateResponse.ok()).toBeTruthy();
  });

  await test.step("TC10.3 - open reset password page", async () => {
    // Given

    // When
    await openUpdatePasswordPage(page, reusedToken);

    // Then
    await expect(updatePasswordTitle(page)).toBeVisible();
  });

  await test.step("TC9.5 - reset password", async () => {
    // Given
    const newPassword = faker.internet.password();

    // When
    await fillPassword(page, newPassword);
    await fillPasswordConfirmation(page, newPassword);
    await clickUpdatePassword(page);

    // Then
    await Promise.all([
      await expect(page).toHaveURL(baseURL || ""),
      await expect(tokenExpiredMessage(page)).toBeVisible(),
    ]);
  });
});
