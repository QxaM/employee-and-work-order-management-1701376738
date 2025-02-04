import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { openHomePage } from "../../utils/navigation.utils";
import {
  clickRegisterButton,
  fillRegistrationDetails,
  invalidEmailMessage,
  openRegisterPage,
  passwordEmptyMessage,
  passwordMismatchMessage,
  passwordTooShortMessage,
  registerError,
  successfullRegistrationMessage,
} from "./register.utils";

test("TC3 - should register with valid credentials", async ({
  page,
  baseURL,
}) => {
  // Given
  const email = faker.internet.email();
  const password = "Test12345";
  await openHomePage(page);
  await openRegisterPage(page);

  // When
  await fillRegistrationDetails(page, {
    email,
    password,
    passwordConfirmation: password,
  });
  await clickRegisterButton(page);

  // Then
  await Promise.all([
    await expect(registerError(page)).toBeHidden(),
    await expect(page).toHaveURL(baseURL || ""),
    await expect(successfullRegistrationMessage(page)).toBeVisible(),
  ]);
});

test("TC4 - should validate register fields", async ({ page }) => {
  // Given
  const correctEmail = faker.internet.email();
  const correctPassword = "Test12345";
  await openHomePage(page);
  await openRegisterPage(page);

  await test.step(`TC4.1 - should validate invalid email`, async () => {
    // Given
    const invalidEmail = "@maxq.com";

    // When
    await fillRegistrationDetails(page, {
      email: invalidEmail,
      password: correctPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(invalidEmailMessage(page)).toBeVisible();
  });

  await test.step(`TC4.2 - should validate invalid email (without @)`, async () => {
    // Given
    const invalidEmail = "testmaxq.com";

    // When
    await fillRegistrationDetails(page, {
      email: invalidEmail,
      password: correctPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(invalidEmailMessage(page)).toBeVisible();
  });

  await test.step(`TC4.3 - should validate invalid email (without domain)`, async () => {
    // Given
    const invalidEmail = "test@.com";

    // When
    await fillRegistrationDetails(page, {
      email: invalidEmail,
      password: correctPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(invalidEmailMessage(page)).toBeVisible();
  });

  await test.step(`TC4.4 - should validate invalid email (without TLD)`, async () => {
    // Given
    const invalidEmail = "test@maxq";

    // When
    await fillRegistrationDetails(page, {
      email: invalidEmail,
      password: correctPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(invalidEmailMessage(page)).toBeVisible();
  });

  await test.step(`TC4.5 - should validate invalid password (too short)`, async () => {
    // Given
    const invalidPassword = "tes";

    // When
    await fillRegistrationDetails(page, {
      email: correctEmail,
      password: invalidPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(passwordTooShortMessage(page)).toBeVisible();
  });

  await test.step(`TC4.6 - should validate invalid password (empty password)`, async () => {
    // Given
    const invalidPassword = "";

    // When
    await fillRegistrationDetails(page, {
      email: correctEmail,
      password: invalidPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(passwordEmptyMessage(page)).toBeVisible();
  });

  await test.step(`TC4.7 - should validate invalid confirm password (password mismatch)`, async () => {
    // Given
    const invalidPassword = "tes";

    // When
    await fillRegistrationDetails(page, {
      email: correctEmail,
      password: correctPassword,
      passwordConfirmation: invalidPassword,
    });

    // Then
    await expect(passwordMismatchMessage(page)).toBeVisible();
  });
});
