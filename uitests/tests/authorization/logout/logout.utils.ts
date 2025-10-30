import { Page } from "playwright";

export const logout = async (page: Page) => {
  await page.getByRole("button").locator("img").click();
  await page.getByText("Logout").click();

  const logoutDialog = page.getByRole("alertdialog", { name: "Logout" });
  await logoutDialog.waitFor({ state: "visible" });
  await logoutDialog.getByRole("button", { name: "Logout" }).click();
};

export const logoutSuccessfulMessage = (page: Page) => {
  return page
    .getByTestId("modal-message")
    .getByText("You have been logged out successfully.");
};
