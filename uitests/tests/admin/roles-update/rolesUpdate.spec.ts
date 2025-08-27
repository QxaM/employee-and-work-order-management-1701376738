import { expect, test } from "../../base/baseTest";

import { openHomePage, openRoleUpdatePage } from "../../utils/navigation.utils";
import userCredentials from "../../../test-data/credentials.json";
import { Credentials } from "../../types/Authorization";
import { Locator } from "playwright";

test("TC15 - should navigate to role update list", async ({ adminPage }) => {
  // Given
  const roleUpdateTitle = "User Roles Update";
  const credentials = userCredentials.admin as Credentials;
  await openHomePage(adminPage);

  // When
  await adminPage.getByText("Admin", { exact: true }).hover();
  await adminPage.getByText("Roles Update").click();

  const pageTitle = adminPage.getByText(roleUpdateTitle);
  const userRow = adminPage.getByRole("link", { name: credentials.login });

  // Then
  await expect(pageTitle).toBeVisible();
  await expect(userRow).toBeVisible();
});

test("TC16 - should update role", async ({ adminPage, registeredUser }) => {
  const { email } = registeredUser;
  await openRoleUpdatePage(adminPage);

  let userRow: Locator;
  await test.step("TC16.1 - find user on list", async () => {
    // Given
    await adminPage
      .getByText("User Roles Update")
      .waitFor({ state: "visible" });
    const paginationLabel = "pagination control";
    const pagination = adminPage.getByLabel(paginationLabel);

    // When + Then
    let pageNumber = 1;
    await expect(async () => {
      const paginationNumber = pagination.getByRole("link", {
        name: pageNumber.toString(),
      });
      await expect(paginationNumber).toBeVisible();

      await paginationNumber.click();
      pageNumber++;
      await expect(async () => {
        const cardsCount = await adminPage.locator(".rt-Card").count();
        expect(cardsCount).toBeGreaterThan(2);
      }).toPass();

      userRow = adminPage.getByRole("link", { name: email });
      await expect(userRow).toBeVisible({ timeout: 1_000 });
    }).toPass();
  });

  const cardWrapper = adminPage
    .locator(".rt-Card")
    .filter({ hasText: email })
    .first();

  await test.step("TC16.2 - add role", async () => {
    // Given
    const currentRolesTitle = "Current roles:";
    const roleToAdd = "OPERATOR"; // New User is always DESIGNER first
    const currentRoles = cardWrapper
      .locator(".rt-Flex")
      .filter({ hasText: currentRolesTitle })
      .first();

    // When
    await cardWrapper.getByText(roleToAdd).click();

    // Then
    await expect(currentRoles).toContainText(roleToAdd);
  });

  await test.step("TC16.3 - remove role", async () => {
    // Given
    const addRolesTitle = "Add role:";
    const roleToRemove = "DESIGNER"; // New User is always a designer first
    const addRoles = cardWrapper
      .locator(".rt-Flex")
      .filter({ hasText: addRolesTitle })
      .first();

    // When
    await cardWrapper.getByText(roleToRemove).click();

    // Then
    await expect(addRoles).toContainText(roleToRemove);
  });
});

test("TC20 - should show error element when loader fails", async ({
  adminPage,
}) => {
  // Given
  await adminPage.route("**/users?*", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        code: "InternalError",
        message: "Internal Server Error",
      }),
    });
  });

  // When
  await openRoleUpdatePage(adminPage);

  // Then
  await expect(adminPage.getByText("Error 500")).toBeVisible();
  await expect(adminPage.getByText("Internal Server Error")).toBeVisible();
});
