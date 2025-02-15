import { Page } from "playwright";

export const openHomePage = async (page: Page) => {
  await page.goto(".");
};

export const openLoginPage = async (page: Page) => {
  await page.goto("/login");
};

export const openUpdatePasswordPage = async (page: Page, token: string) => {
  await page.goto(`/password/confirm?token=${token}`);
};
