import { Page, test as base } from "@playwright/test";

type Fixture = {
  adminPage: Page;
};

const adminStorage = "test-data/auth/admin.json";

export const test = base.extend<Fixture>({
  adminPage: async ({ browser }, use) => {
    const page = await browser.newPage({ storageState: adminStorage });
    await use(page);
  },
});

export { expect } from "@playwright/test";
