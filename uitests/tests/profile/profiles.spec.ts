import { expect, test } from "../base/baseTest";
import { Credentials, Token } from "../types/Authorization";
import { openHomePage, openProfilePage } from "../utils/navigation.utils";
import { navigateToProfile } from "./profiles.utils";

import credentials from "../../test-data/credentials.json";
import profiles from "../../test-data/profiles.json";
import { ProfileData } from "../types/Profile";
import { getMyProfile } from "../utils/profile.api.utils";
import { loginApi } from "../utils/authorization.api.utils";
import { buildContextStorage } from "../setup/setup.utils";

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

test("TC23 - should show newly registered profile", async ({
  apiContext,
  registeredUser,
  baseURL,
  browser,
}) => {
  await test.step("TC23.1 - profile should already exits", async () => {
    await expect(async () => {
      // Given
      const email = registeredUser.email;
      const roles = ["ROLE_OPERATOR"];

      // When
      let profileData: ProfileData = await getMyProfile(
        apiContext,
        email,
        roles,
      );

      // Then
      expect(profileData).toBeDefined();
    }).toPass();
  });

  await test.step("TC23.2 - profile should be displayed", async () => {
    // Given
    const email = registeredUser.email;
    const password = registeredUser.password;
    const token: Token = await loginApi(apiContext, { login: email, password });
    const context = buildContextStorage(baseURL, token);
    const page = await browser.newPage({ storageState: context });

    // When
    await openProfilePage(page);

    // Then
    await Promise.all([
      await expect(
        page
          .locator("section")
          .getByText(registeredUser.firstName, { exact: true }),
      ).toBeVisible(),
      await expect(
        page.getByText(registeredUser.lastName, { exact: true }),
      ).toBeVisible(),
      await expect(
        page.getByRole("link", { name: registeredUser.email }),
      ).toBeVisible(),
    ]);
  });
});
