import { Page } from "playwright";

export const openHomePage = async (page: Page) => {
  await page.goto(".");
};

export const openLoginPage = async (page: Page) => {
  await page.goto("/login");
};

export const openResetPasswordPage = async (page: Page) => {
  await page.goto("/password/request");
};

export const openUpdatePasswordPage = async (page: Page, token: string) => {
  await page.goto(`/password/confirm?token=${token}`);
};

export const openProfilePage = async (page: Page) => {
  await page.goto("/profile");
};

export const openAdminPage = async (page: Page) => {
  await page.goto("/admin");
};

export const openRoleUpdatePage = async (page: Page) => {
  await page.goto("/admin/roles-update");
};
