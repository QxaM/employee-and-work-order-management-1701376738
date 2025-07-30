import { expect, test } from "../../base/baseTest";
import { openAdminPage } from "../../utils/navigation.utils";
import { notLoggedInMessage } from "./roles.utils";

test("TC18 - should navigate to login if user is not logged in", async ({
  page,
}) => {
  // Given

  // When
  await openAdminPage(page);

  // Then
  await expect(page).toHaveURL("/login");
  await expect(notLoggedInMessage(page)).toBeVisible();
});
