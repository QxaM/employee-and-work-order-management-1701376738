import { Page } from "playwright";

export const navigateToProfile = async (page: Page, email: string) => {
  const avatarLetter = email.charAt(0).toUpperCase();
  await page.getByRole("button", { name: avatarLetter, exact: true }).click();
  await page.getByRole("menuitem", { name: "Profile" }).click();
};
