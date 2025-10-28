import { Page } from "playwright";

export const clickLogout = async (page: Page) => {
  await page.getByRole("button").locator("img").click();
  await page.getByText("Logout").click();
};

export const logoutSuccessfulMessage = (page: Page) => {
  return page
    .getByTestId("modal-message")
    .getByText("You have been logged out successfully.");
};
