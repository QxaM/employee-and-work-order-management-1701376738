import {expect, test} from "../base/baseTest";
import {openProfilePage} from "../utils/navigation.utils";

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
