import { expect, test } from "../../base/baseTest";
import { openHomePage } from "../../utils/navigation.utils";
import { clickLogout, logoutSuccessfulMessage } from "./logout.utils";

test("TC30 - should logout correctly", async ({ adminPage, baseURL }) => {
  // Given
  await openHomePage(adminPage);

  // When
  await clickLogout(adminPage);

  // Then
  await Promise.all([
    expect(logoutSuccessfulMessage(adminPage)).toBeVisible(),
    expect(adminPage.url()).toEqual(baseURL + "/"),
  ]);
});
