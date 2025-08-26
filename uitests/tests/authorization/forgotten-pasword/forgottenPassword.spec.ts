import { expect, test } from "../../base/baseTest";
import { faker } from "@faker-js/faker";
import {
  clickForgotPassword,
  clickResetPassword,
  clickUpdatePassword,
  fillEmail,
  fillPassword,
  fillPasswordConfirmation,
  passwordResetTitle,
  resetPasswordError,
  resetPasswordSuccessfullMessage,
  tokenExpiredMessage,
  updatePasswordSuccessfullMessage,
  updatePasswordTitle,
} from "./forgottenPassword.utils";
import {
  openLoginPage,
  openResetPasswordPage,
  openUpdatePasswordPage,
} from "../../utils/navigation.utils";
import { login, loginError, welcomeMessage } from "../login/login.utils";
import {
  invalidEmailMessage,
  passwordConfirmationEmptyMessage,
  passwordEmptyMessage,
  passwordMismatchMessage,
  passwordTooShortMessage,
} from "../register/register.utils";
import {
  getTokenApi,
  passwordResetApi,
  passwordUpdateApi,
} from "../../utils/authorization.api.utils";

test("TC9 - should correctly reset password", async ({
  page,
  baseURL,
  registeredUser,
  apiContext,
}) => {
  const { email } = registeredUser;

  await test.step("TC9.1 - open reset password page", async () => {
    // Given
    await openLoginPage(page);

    // When
    await clickForgotPassword(page);

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
    let resetPasswordToken: undefined | string;
    await expect(async () => {
      try {
        resetPasswordToken = await getTokenApi(apiContext, email);
      } catch {
        // Empty catch, redo the request
      }
      expect(resetPasswordToken).toBeDefined();
    }).toPass();

    // When
    await openUpdatePasswordPage(page, resetPasswordToken!);

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
      await expect(welcomeMessage(page, email)).toBeVisible(),
    ]);
  });
});

test("TC10 - should not allow to reuse token", async ({
  page,
  baseURL,
  registeredUser,
  apiContext,
}) => {
  const { email } = registeredUser;
  let reusedToken: string | undefined;

  await test.step("TC10.1 - request password reset", async () => {
    // Given
    await expect(async () => {
      let reusedToken: string | undefined;
      try {
        reusedToken = await getTokenApi(apiContext, email);
      } catch {
        // Empty just to retry
      }
      expect(reusedToken).toBeUndefined();
    }).toPass();

    // When + Then
    await expect(passwordResetApi(apiContext, email)).resolves.toBeUndefined();
  });

  await test.step("TC10.2 - use token for the first time", async () => {
    // Given
    const newPassword = faker.internet.password();
    await expect(async () => {
      try {
        reusedToken = await getTokenApi(apiContext, email);
      } catch {
        // Empty just to retry
      }
      expect(reusedToken).toBeDefined();
    }).toPass();

    // When + Then
    await expect(async () => {
      await passwordUpdateApi(apiContext, newPassword, reusedToken!);
    }).toPass();
  });

  await test.step("TC10.3 - open reset password page", async () => {
    // Given

    // When
    await openUpdatePasswordPage(page, reusedToken!);

    // Then
    await expect(updatePasswordTitle(page)).toBeVisible();
  });

  await test.step("TC10.4 - reset password", async () => {
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

test("TC11 - should handle correctly non-existent email", async ({
  page,
  baseURL,
  apiContext,
}) => {
  const nonExistentEmail = faker.internet.email();

  await test.step("TC11.1 - request password reset", async () => {
    // Given
    await openResetPasswordPage(page);

    // When
    await fillEmail(page, nonExistentEmail);
    await clickResetPassword(page);

    // Then
    await Promise.all([
      await expect(page).toHaveURL(baseURL || ""),
      await expect(resetPasswordSuccessfullMessage(page)).toBeVisible(),
    ]);
  });

  await test.step("TC11.2 - open reset password page", async () => {
    // Given

    // When + Then
    await expect(async () => {
      await expect(getTokenApi(apiContext, nonExistentEmail)).rejects.toThrow();
    }).toPass();
  });
});

test("TC12 - should handle correctly invalid token", async ({
  page,
  baseURL,
  registeredUser,
}) => {
  const { email } = registeredUser;
  let newPassword = faker.internet.password();

  await test.step("TC12.1 - try to reset password", async () => {
    // Given
    await openUpdatePasswordPage(page, "invalidToken");

    // When
    await fillPassword(page, newPassword);
    await fillPasswordConfirmation(page, newPassword);
    await clickUpdatePassword(page);

    // Then
    await Promise.all([
      await expect(page).toHaveURL(baseURL || ""),
      await expect(resetPasswordError(page)).toBeVisible(),
    ]);
  });

  await test.step("TC12.2 - cannot log in when update failed", async () => {
    // Given
    await openLoginPage(page);

    // When
    await login(page, email, newPassword);

    // Then
    await expect(loginError(page)).toBeVisible();
  });
});

test("TC13 - should validate email during password reset", async ({
  page,
  baseURL,
}) => {
  // Given
  const invalidEmail = "test@";
  await openResetPasswordPage(page);

  // When
  await fillEmail(page, invalidEmail);
  await clickResetPassword(page);

  // Then
  await Promise.all([
    await expect(page).not.toHaveURL(baseURL || ""),
    await expect(invalidEmailMessage(page)).toBeVisible(),
  ]);
});

test("TC14 - should validate password during password registration", async ({
  page,
  baseURL,
}) => {
  await test.step("TC14.1 - should validate invalid password (too short)", async () => {
    // Given
    await openUpdatePasswordPage(page, "invalidToken");
    const invalidPassword = "123";

    // When
    await fillPassword(page, invalidPassword);
    await fillPasswordConfirmation(page, invalidPassword);
    await clickUpdatePassword(page);

    // Then
    await Promise.all([
      await expect(page).not.toHaveURL(baseURL || ""),
      await expect(passwordTooShortMessage(page)).toBeVisible(),
    ]);
  });

  await test.step("TC14.2 - should validate invalid password (empty)", async () => {
    // Given
    await openUpdatePasswordPage(page, "invalidToken");

    // When
    await clickUpdatePassword(page);

    // Then
    await Promise.all([
      await expect(page).not.toHaveURL(baseURL || ""),
      await expect(passwordEmptyMessage(page)).toBeVisible(),
    ]);
  });

  await test.step("TC14.3 - should validate password confirmation (mismatch)", async () => {
    // Given
    await openUpdatePasswordPage(page, "invalidToken");
    const validPassword = "1234";

    // When
    await fillPassword(page, validPassword);
    await fillPasswordConfirmation(page, "4321");
    await clickUpdatePassword(page);

    // Then
    await Promise.all([
      await expect(page).not.toHaveURL(baseURL || ""),
      await expect(passwordMismatchMessage(page)).toBeVisible(),
    ]);
  });

  await test.step("TC14.4 - should validate password confirmation (empty)", async () => {
    // Given
    await openUpdatePasswordPage(page, "invalidToken");
    const validPassword = "1234";

    // When
    await fillPassword(page, validPassword);
    await clickUpdatePassword(page);

    // Then
    await Promise.all([
      await expect(page).not.toHaveURL(baseURL || ""),
      await expect(passwordConfirmationEmptyMessage(page)).toBeVisible(),
    ]);
  });
});
