import { expect, test } from "../../base/baseTest";
import { openHomePage } from "../../utils/navigation.utils";
import credentials from "../../../test-data/credentials.json";
import { Credentials } from "../../types/Authorization";

test("TC21 - role elements should be hidden after logout", async ({
  adminPage,
}) => {
  // Given
  const userCredentials = credentials.admin as Credentials;
  const avatarLetter = userCredentials.login.charAt(0).toUpperCase();
  await openHomePage(adminPage);

  // When
  await adminPage
    .getByRole("button", { name: avatarLetter, exact: true })
    .click();
  await adminPage.getByText("Logout").click();

  // Then
  await expect(adminPage.getByText("Admin", { exact: true })).toBeHidden();
});
