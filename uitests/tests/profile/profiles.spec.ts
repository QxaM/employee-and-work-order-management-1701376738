import { expect, test } from "../base/baseTest";
import { Credentials, Token } from "../types/Authorization";
import { openHomePage, openProfilePage } from "../utils/navigation.utils";
import {
  clickEditProfile,
  clickSaveProfile,
  fillProfileDetails,
  navigateToProfile
} from "./profiles.utils";

import credentials from "../../test-data/credentials.json";
import profiles from "../../test-data/profiles.json";
import { ProfileData } from "../types/Profile";
import { getMyProfile } from "../utils/profile.api.utils";
import { loginApi } from "../utils/authorization.api.utils";
import { buildContextStorage } from "../setup/setup.utils";
import { faker } from "@faker-js/faker";

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

test("TC24 - should update profile", async ({
  apiContext,
  registeredUser,
  baseURL,
  browser,
}) => {
  await test.step("TC24.1 - profile should already exits", async () => {
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

  await test.step("TC24.2 - profile should be updated", async () => {
    // Given
    const firstName = faker.person.firstName();
    const middleName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const email = registeredUser.email;
    const password = registeredUser.password;
    const token: Token = await loginApi(apiContext, { login: email, password });
    const context = buildContextStorage(baseURL, token);
    const page = await browser.newPage({ storageState: context });

    await openProfilePage(page);

    // When
    await clickEditProfile(page);
    await fillProfileDetails(page, {
      firstName,
      middleName,
      lastName,
    });
    await page.getByRole("button", { name: "Save" }).click();

    // Then
    await expect(async () => {
      await Promise.all([
        await expect(
          page.locator("section").getByText(firstName, { exact: true }),
        ).toBeVisible(),
        await expect(page.getByText(middleName, { exact: true })).toBeVisible(),
        await expect(page.getByText(lastName, { exact: true })).toBeVisible(),
      ]);
    }).toPass();
  });
});

test("TC25 - should show error, when request fails", async ({ adminPage }) => {
  // Given
  const errorMessage = "Bad profile update request";
  await adminPage.route("**/profiles/me", async (route) => {
    if (route.request().method() === "PUT") {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          code: "Bad Request",
          message: errorMessage,
        }),
      });
    } else {
      await route.continue();
    }
  });

  await openProfilePage(adminPage);

  // When
  await clickEditProfile(adminPage);
  await clickSaveProfile(adminPage);
  const errorMessageElement = adminPage.getByText(
    new RegExp(`^${errorMessage}$`),
  );

  // Then
  await expect(errorMessageElement).toBeVisible();
});
