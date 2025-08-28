import { Locator, Page } from "playwright";

export interface RegisterDetails {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const openRegisterPage = async (page: Page) => {
  await page.getByRole("link", { name: "Sign up" }).click();
};

export const fillRegistrationDetails = async (
  page: Page,
  registerDetails: RegisterDetails,
) => {
  await page
    .getByRole("textbox", { name: "first name" })
    .fill(registerDetails.firstName);
  await page
    .getByRole("textbox", { name: "middle name" })
    .fill(registerDetails.middleName ?? "");
  await page
    .getByRole("textbox", { name: "last name" })
    .fill(registerDetails.lastName);
  await page
    .getByRole("textbox", { name: "email" })
    .fill(registerDetails.email);
  await page
    .getByRole("textbox", { name: "password", exact: true })
    .fill(registerDetails.password);
  await page
    .getByRole("textbox", { name: "confirm password" })
    .fill(registerDetails.passwordConfirmation);
};

export const clickRegisterButton = async (page: Page) => {
  await page.getByRole("button", { name: "Create Account" }).click();
};

export const registerError = (page: Page): Locator => {
  return page.getByText("User with this email already exists!");
};

export const successfullRegistrationMessage = (page: Page): Locator => {
  return page.getByText(/^You have been registered successfully!/);
};

export const firstNameEmptyMessage = (page: Page): Locator => {
  return page.getByText("First name is required");
};

export const lastNameEmptyMessage = (page: Page): Locator => {
  return page.getByText("Last name is required");
};

export const invalidEmailMessage = (page: Page): Locator => {
  return page.getByText("Please enter a valid email address");
};

export const passwordTooShortMessage = (page: Page): Locator => {
  return page.getByText("Password should have at least 4 characters");
};

export const passwordShouldContainUppercaseMessage = (page: Page): Locator => {
  return page.getByText("Password must contain at least one uppercase letter");
};

export const passwordShouldContainLowercaseMessage = (page: Page): Locator => {
  return page.getByText("Password must contain at least one lowercase letter");
};

export const passwordShouldContainNumberMessage = (page: Page): Locator => {
  return page.getByText("Password must contain at least one number");
};

export const passwordMismatchMessage = (page: Page): Locator => {
  return page.getByText("Passwords do not match");
};

export const passwordConfirmationEmptyMessage = (page: Page): Locator => {
  return page.getByText("Confirm password is required");
};

export const successfullConfirmationMessage = (page: Page): Locator => {
  return page.getByText("Verification was successfull - you can now login", {
    exact: true,
  });
};

export const expiredTokenMessage = (page: Page): Locator => {
  return page.getByText("Token is expired - sent a new one", { exact: true });
};
