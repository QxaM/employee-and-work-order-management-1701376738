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
  await adminPage.getByText("Admin", { exact: true }).click();
  await adminPage.getByText("Roles Update").click();

  const pageTitle = adminPage.getByText(roleUpdateTitle);
  const userRow = adminPage
    .getByRole("cell", { name: credentials.login })
    .locator("..");

  // Then
  await expect(pageTitle).toBeVisible();
  await expect(userRow).toBeVisible();
});

test.describe("Update Roles", () => {
  const roleUpdateDialogTitle = "Roles Update Form";

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
          const rowsCount = await adminPage.getByRole("row").count();
          expect(rowsCount).toBeGreaterThan(1);
        }).toPass();

        userRow = adminPage.getByRole("cell", { name: email }).locator("..");
        await expect(userRow).toBeVisible({ timeout: 1_000 });
      }).toPass();
    });

    await test.step("TC16.2 - open role dialog", async () => {
      // Given

      // When
      await userRow.click();

      // Then
      await expect(adminPage.getByText(roleUpdateDialogTitle)).toBeVisible();
      await expect(adminPage.locator("data").getByText(email)).toBeVisible();
    });

    await test.step("TC16.3 - update role", async () => {
      // Give
      const roleToRemove = "DESIGNER"; // New User is always a designer first
      const roleToAdd = "OPERATOR";

      const addRoleLabel = "add role";
      const removeRoleLabel = "remove role";

      const updateRoleButton = "Update";

      const userId = await adminPage.locator("data").first().textContent();
      const successMessage = `Successfully updated roles for user ${userId}`;

      // When
      await adminPage.getByRole("button", { name: roleToAdd }).click();
      await adminPage.getByLabel(addRoleLabel).click();

      await adminPage.getByRole("button", { name: roleToRemove }).click();
      await adminPage.getByLabel(removeRoleLabel).click();

      await adminPage.getByRole("button", { name: updateRoleButton }).click();

      // Then
      await Promise.all([
        expect(adminPage.getByText(roleUpdateDialogTitle)).toBeHidden(),
        expect(adminPage.getByText(successMessage)).toBeVisible(),
      ]);
    });
  });

  test("TC17 - should not duplicate assigned roles", async ({
    adminPage,
    registeredUser,
  }) => {
    const { email } = registeredUser;
    await openRoleUpdatePage(adminPage);

    let userRow: Locator;
    await test.step("TC17.1 - find user on list", async () => {
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
          const rowsCount = await adminPage.getByRole("row").count();
          expect(rowsCount).toBeGreaterThan(1);
        }).toPass();

        userRow = adminPage.getByRole("cell", { name: email }).locator("..");
        await expect(userRow).toBeVisible({ timeout: 1_000 });
      }).toPass();
    });

    await test.step("TC17.2 - open role dialog", async () => {
      // Given

      // When
      await userRow.click();

      // Then
      await expect(adminPage.getByText(roleUpdateDialogTitle)).toBeVisible();
      await expect(adminPage.locator("data").getByText(email)).toBeVisible();
    });

    await test.step("TC17.3 - should not duplicate assigned roles", async () => {
      // Given
      const roleToAdd = "OPERATOR";
      const addRoleLabel = "add role";

      // When
      await adminPage.getByRole("button", { name: roleToAdd }).click();
      await adminPage.getByLabel(addRoleLabel).click();
      const operatorRoles = adminPage.getByRole("button", { name: roleToAdd });

      // Then
      await expect(operatorRoles).toHaveCount(1);
    });
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
