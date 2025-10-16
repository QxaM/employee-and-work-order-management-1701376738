import { Page } from "playwright";

interface UpdateProfileType {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export const navigateToProfile = async (page: Page) => {
  await page.getByRole("button").locator("img").click();
  await page.getByRole("menuitem", { name: "Profile" }).click();
};

export const clickEditProfile = async (page: Page) => {
  await page.getByRole("button", { name: "Edit profile" }).click();
};

export const clickUploadImage = async (page: Page) => {
  await page.getByLabel("upload avatar").click();
};

export const clickSaveProfile = async (page: Page) => {
  await page.getByRole("button", { name: "Save changes" }).click();
};

export const fillProfileDetails = async (
  page: Page,
  profile: UpdateProfileType,
) => {
  await page
    .getByRole("textbox", { name: "first name" })
    .fill(profile.firstName);
  await page
    .getByRole("textbox", { name: "middle name" })
    .fill(profile.middleName ?? "");
  await page.getByRole("textbox", { name: "last name" }).fill(profile.lastName);
};
