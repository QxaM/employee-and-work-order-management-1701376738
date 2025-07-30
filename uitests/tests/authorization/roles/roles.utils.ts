import { Page } from "playwright";

export const notLoggedInMessage = (page: Page) => {
  return page.getByText("You are not logged in! Please log in.");
};

export const notAuthorizedMessage = (page: Page) => {
  return page.getByText(
    "You are not authorized to access this page. Please log in.",
  );
};
