import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { openHomePage } from "../../utils/navigation.utils";
import {
  clickRegisterButton,
  fillRegistrationDetails,
  openRegisterPage,
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
