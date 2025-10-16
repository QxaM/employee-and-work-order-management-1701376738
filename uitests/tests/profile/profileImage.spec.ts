import { expect, test } from "../base/baseTest";
import { openProfilePage } from "../utils/navigation.utils";
import { loginApi } from "../utils/authorization.api.utils";
import { ProfileData } from "../types/Profile";
import { getMyProfile } from "../utils/profile.api.utils";
import { Token } from "../types/Authorization";
import { buildContextStorage } from "../setup/setup.utils";
import { Page } from "playwright";
import {
  clickEditProfile,
  clickSaveProfile,
  clickUploadImage,
} from "./profiles.utils";

test("TC26 - should show profile image", async ({ adminPage }) => {
  // Given
  const profileImage = adminPage
    .getByTestId("avatar-container")
    .getByRole("img");

  // When
  await openProfilePage(adminPage);

  // Then
  await expect(profileImage).toBeVisible();
});

test("TC27 - should validate profile image during upload", async ({
  baseURL,
  browser,
  apiContext,
  registeredUser,
}) => {
  await test.step("TC27.1 - profile should already exits", async () => {
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

  let page: Page;

  await test.step("TC27.2 - login user", async () => {
    // Given
    const email = registeredUser.email;
    const password = registeredUser.password;

    // When
    const token: Token = await loginApi(apiContext, { login: email, password });
    const context = buildContextStorage(baseURL, token);
    page = await browser.newPage({ storageState: context });

    // Then
    expect(page).toBeDefined();
  });

  await test.step("TC27.3 - should validate profile image", async () => {
    // Given
    await openProfilePage(page);
    await clickEditProfile(page);

    // When
    const fileChooserPromise = page.waitForEvent("filechooser");
    await clickUploadImage(page);
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles("resources/images/incorrect-file.jpg");

    // Then
    await expect(
      page.getByText(
        "Invalid file name. Only numbers and characters are allowed",
      ),
    ).toBeVisible();
  });
});

test("TC28 - should show success when success", async ({
  baseURL,
  browser,
  apiContext,
  registeredUser,
}) => {
  await test.step("TC28.1 - profile should already exits", async () => {
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

  let page: Page;

  await test.step("TC28.2 - login user", async () => {
    // Given
    const email = registeredUser.email;
    const password = registeredUser.password;

    // When
    const token: Token = await loginApi(apiContext, { login: email, password });
    const context = buildContextStorage(baseURL, token);
    page = await browser.newPage({ storageState: context });

    // Then
    expect(page).toBeDefined();
  });

  await test.step("TC28.3 - should upload profile image", async () => {
    // Given
    await openProfilePage(page);
    await clickEditProfile(page);

    // When
    const fileChooserPromise = page.waitForEvent("filechooser");
    await clickUploadImage(page);
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles("resources/images/correctJpeg.jpg");
    await clickSaveProfile(page);

    // Then
    await expect(
      page
        .getByTestId("modal-message")
        .getByText("Profile image updated successfully"),
    ).toBeVisible();
  });
});

test("TC29 - should show API error message", async ({
  baseURL,
  browser,
  apiContext,
  registeredUser,
}) => {
  await test.step("TC29.1 - profile should already exits", async () => {
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

  let page: Page;

  await test.step("TC29.2 - login user", async () => {
    // Given
    const email = registeredUser.email;
    const password = registeredUser.password;

    // When
    const token: Token = await loginApi(apiContext, { login: email, password });
    const context = buildContextStorage(baseURL, token);
    page = await browser.newPage({ storageState: context });

    // Then
    expect(page).toBeDefined();
  });

  await test.step("TC29.3 - should upload profile image", async () => {
    // Given
    const errorMessage = "Bad profile update request";
    const errors: string[] = [
      "Unknown image format",
      "Image size exceeds the limit",
    ];
    await page.route("**/profiles/me/image", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({
            message: errorMessage,
            errors,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await openProfilePage(page);
    await clickEditProfile(page);

    // When
    const fileChooserPromise = page.waitForEvent("filechooser");
    await clickUploadImage(page);
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles("resources/images/correctJpeg.jpg");
    await clickSaveProfile(page);

    // Then
    const errorMessageElement = page
      .getByTestId("modal-message")
      .getByText(errorMessage);
    const errorsLocators = errors.map((error) =>
      page.getByTestId("modal-message").getByText(error),
    );
    await expect(errorMessageElement).toBeVisible();
    for (const errorLocator of errorsLocators) {
      await expect(errorLocator).toBeVisible();
    }
  });
});
