import { Page } from "playwright";

export const notLoggedInMessage = (page: Page) => {
  return page.getByText("You are not logged in! Please log in.");
};
