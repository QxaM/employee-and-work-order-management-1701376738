import { Locator, Page } from "playwright";

export const passwordResetTitle = (page: Page): Locator => {
  return page.getByRole("heading", { name: "Reset Password" });
};

export const updatePasswordTitle = (page: Page): Locator => {
  return page.getByRole("heading", { name: "Update Password" });
};

export const fillEmail = async (page: Page, email: string) => {
  await page.getByRole("textbox", { name: "email address" }).fill(email);
};

export const fillPassword = async (page: Page, password: string) => {
  await page
    .getByRole("textbox", { name: "password", exact: true })
    .fill(password);
};

export const fillPasswordConfirmation = async (
  page: Page,
  password: string,
) => {
  await page.getByRole("textbox", { name: "confirm password" }).fill(password);
};

export const clickResetPassword = async (page: Page) => {
  await page.getByRole("button", { name: "Send Reset Link" }).click();
};

export const clickUpdatePassword = async (page: Page) => {
  await page.getByRole("button", { name: "Update Password" }).click();
};

export const clickForgotPassword = async (page: Page) => {
  await page.getByRole("link", { name: "Forgot password?" }).click();
};

export const resetPasswordSuccessfullMessage = (page: Page): Locator => {
  return page.getByText(
    "Email was sent if provided email exists in our database.",
    { exact: true },
  );
};

export const updatePasswordSuccessfullMessage = (page: Page): Locator => {
  return page.getByText("Password was updated successfully!", { exact: true });
};

export const tokenExpiredMessage = (page: Page): Locator => {
  return page.getByText("Provided verification token was already used", {
    exact: true,
  });
};

export const resetPasswordError = (page: Page): Locator => {
  return page.getByText("Error during verification process, try again later", {
    exact: true,
  });
};
