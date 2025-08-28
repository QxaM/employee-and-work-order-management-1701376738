import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { openHomePage } from "../../utils/navigation.utils";
import {
  clickRegisterButton,
  fillRegistrationDetails,
  firstNameEmptyMessage,
  invalidEmailMessage,
  lastNameEmptyMessage,
  openRegisterPage,
  passwordMismatchMessage,
  passwordShouldContainLowercaseMessage,
  passwordShouldContainNumberMessage,
  passwordShouldContainUppercaseMessage,
  passwordTooShortMessage,
  registerError,
  successfullRegistrationMessage
} from "./register.utils";

import credentials from "../../../test-data/credentials.json";
import { Credentials } from "../../types/Authorization";

const userCredentials = credentials.admin as Credentials;

test("TC3 - should register with valid credentials", async ({
  page,
  baseURL,
}) => {
  // Given
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  const password = "Test12345";
  await openHomePage(page);
  await openRegisterPage(page);

  // When
  await fillRegistrationDetails(page, {
    firstName,
    lastName,
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
  const correctFirstName = faker.person.firstName();
  const correctLastName = faker.person.lastName();
  const correctEmail = faker.internet.email();
  const correctPassword = "Test12345";
  await openHomePage(page);
  await openRegisterPage(page);

  await test.step(`TC4.1 - should validate invalid email`, async () => {
    // Given
    const invalidEmail = "@maxq.com";

    // When
    await fillRegistrationDetails(page, {
      firstName: correctFirstName,
      lastName: correctLastName,
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
      firstName: correctFirstName,
      lastName: correctLastName,
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
      firstName: correctFirstName,
      lastName: correctLastName,
      email: invalidEmail,
      password: correctPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(invalidEmailMessage(page)).toBeVisible();
  });

  await test.step(`TC4.4 - should validate invalid password (too short)`, async () => {
    // Given
    const invalidPassword = "Te1";

    // When
    await fillRegistrationDetails(page, {
      firstName: correctFirstName,
      lastName: correctLastName,
      email: correctEmail,
      password: invalidPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(passwordTooShortMessage(page)).toBeVisible();
  });

  await test.step(`TC4.5 - should validate invalid password (missing lowercase)`, async () => {
    // Given
    const invalidPassword = "TEST12345";

    // When
    await fillRegistrationDetails(page, {
      firstName: correctFirstName,
      lastName: correctLastName,
      email: correctEmail,
      password: invalidPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(passwordShouldContainLowercaseMessage(page)).toBeVisible();
  });

  await test.step(`TC4.6 - should validate invalid password (missing uppercase)`, async () => {
    // Given
    const invalidPassword = "test12345";

    // When
    await fillRegistrationDetails(page, {
      firstName: correctFirstName,
      lastName: correctLastName,
      email: correctEmail,
      password: invalidPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(passwordShouldContainUppercaseMessage(page)).toBeVisible();
  });

  await test.step(`TC4.7 - should validate invalid password (missing number)`, async () => {
    // Given
    const invalidPassword = "Test";

    // When
    await fillRegistrationDetails(page, {
      firstName: correctFirstName,
      lastName: correctLastName,
      email: correctEmail,
      password: invalidPassword,
      passwordConfirmation: correctPassword,
    });

    // Then
    await expect(passwordShouldContainNumberMessage(page)).toBeVisible();
  });

  await test.step(`TC4.8 - should validate invalid confirm password (password mismatch)`, async () => {
    // Given
    const invalidPassword = "tes";

    // When
    await fillRegistrationDetails(page, {
      firstName: correctFirstName,
      lastName: correctLastName,
      email: correctEmail,
      password: correctPassword,
      passwordConfirmation: invalidPassword,
    });
    await clickRegisterButton(page);

    // Then
    await expect(passwordMismatchMessage(page)).toBeVisible();
  });

  await test.step("TC4.9 - should validate empty first name", async () => {
    // Given
    const invalidFirstName = "";

    // When
    await fillRegistrationDetails(page, {
      firstName: invalidFirstName,
      lastName: correctLastName,
      email: correctEmail,
      password: correctPassword,
      passwordConfirmation: correctPassword,
    });
    await clickRegisterButton(page);

    // Then
    await expect(firstNameEmptyMessage(page)).toBeVisible();
  });

  await test.step("TC4.10 - should validate empty last name", async () => {
    // Given
    const invalidLastName = "";

    // When
    await fillRegistrationDetails(page, {
      firstName: correctFirstName,
      lastName: invalidLastName,
      email: correctEmail,
      password: correctPassword,
      passwordConfirmation: correctPassword,
    });
    await clickRegisterButton(page);

    // Then
    await expect(lastNameEmptyMessage(page)).toBeVisible();
  });
});

test("TC5 - should not register with existing credentials", async ({
  page,
}) => {
  // Given
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  await openHomePage(page);
  await openRegisterPage(page);

  // When
  await fillRegistrationDetails(page, {
    firstName,
    lastName,
    email: userCredentials.login,
    password: userCredentials.password,
    passwordConfirmation: userCredentials.password,
  });
  await clickRegisterButton(page);

  // Then
  await expect(registerError(page)).toBeVisible();
});
