import { expect, test } from "../../base/baseTest";
import { openHomePage } from "../../utils/navigation.utils";

test("TC21 - role elements should be hidden after logout", async ({
  adminPage,
}) => {
  // Given
  await openHomePage(adminPage);

  // When
  await adminPage.getByText("Logout").click();

  // Then
  await expect(adminPage.getByText("Admin", { exact: true })).toBeHidden();
});
