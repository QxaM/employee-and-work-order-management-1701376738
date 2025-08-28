import { expect, test } from "../base/baseTest";
import { Credentials } from "../types/Authorization";
import { openHomePage } from "../utils/navigation.utils";
import { navigateToProfile } from "./profiles.utils";

import credentials from "../../test-data/credentials.json";
import profiles from "../../test-data/profiles.json";
import { ProfileData } from "../types/Profile";

test("TC22 - should navigate and display user profile", async ({
  adminPage,
}) => {
  // Given
  const profileTitle = "Profile";
  const userCredentials = credentials.admin as Credentials;
  const profile = profiles.admin as ProfileData;
  await openHomePage(adminPage);

  // When
  await navigateToProfile(adminPage, userCredentials.login);

  // Then
  await Promise.all([
    await expect(
      adminPage.getByRole("heading", { name: profileTitle }),
    ).toBeVisible(),
    await expect(
      adminPage
        .locator("section")
        .getByText(profile.firstName, { exact: true }),
    ).toBeVisible(),
    await expect(
      adminPage.getByText(profile.lastName, { exact: true }),
    ).toBeVisible(),
    await expect(
      adminPage.getByRole("link", { name: profile.email }),
    ).toBeVisible(),
  ]);
});
