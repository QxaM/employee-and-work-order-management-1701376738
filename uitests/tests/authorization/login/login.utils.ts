import { Locator, Page } from "playwright";

export const clickLoginButton = async (page: Page) => {
  await page.getByRole("link", { name: "Login" }).click();
};

export const login = async (page: Page, username: string, password: string) => {
  await page.getByRole("textbox", { name: "email" }).fill(username);
  await page.getByRole("textbox", { name: "password" }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
};

export const loginError = (page: Page): Locator => {
  return page.getByText("Login failed. Invalid email or password.");
};

export const welcomeMessage = (page: Page): Locator => {
  return page.getByText("Welcome back!");
};
