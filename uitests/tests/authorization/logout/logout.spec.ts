import { expect, test } from "../../base/baseTest";
import { openAdminPage, openHomePage } from "../../utils/navigation.utils";
import { logout, logoutSuccessfulMessage } from "./logout.utils";
import { notAuthorizedMessage, notLoggedInMessage } from "../roles/roles.utils";

test("TC30 - should logout correctly", async ({ adminPage, baseURL }) => {
  // Given
  await openHomePage(adminPage);

  // When
  await logout(adminPage);

  // Then
  await Promise.all([
    expect(logoutSuccessfulMessage(adminPage)).toBeVisible(),
    expect(adminPage.url()).toEqual(baseURL + "/"),
  ]);
});

test("TC31 - should correctly redirect from protected route", async ({
  adminPage,
  baseURL,
}) => {
  // Given
  await openAdminPage(adminPage);

  // When
  await logout(adminPage);

  // Then
  await Promise.all([
    expect(notAuthorizedMessage(adminPage)).toBeHidden(),
    expect(logoutSuccessfulMessage(adminPage)).toBeVisible(),
    expect(adminPage.url()).toEqual(baseURL + "/"),
  ]);
});

test("TC32 - should block back button to protected route", async ({
  adminPage,
  baseURL,
}) => {
  // Given
  await openAdminPage(adminPage);
  await logout(adminPage);

  await logoutSuccessfulMessage(adminPage).waitFor({ state: "visible" });

  // When
  await adminPage.goBack();

  // Then
  await expect(notLoggedInMessage(adminPage).first()).toBeVisible();
  expect(adminPage.url()).toEqual(baseURL + "/login");
});
