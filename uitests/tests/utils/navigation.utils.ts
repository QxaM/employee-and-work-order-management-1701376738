import { Page } from "playwright";

export const openHomePage = async (page: Page) => {
  await page.goto(".");
};
