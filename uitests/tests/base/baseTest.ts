/* eslint-disable playwright/no-standalone-expect */
import { APIRequestContext, expect, Page, test as base } from "@playwright/test";
import {
  createApiContext,
  getTokenApi,
  registerApi,
  registerConfirmationApi
} from "../utils/authorization.api.utils";
import { faker } from "@faker-js/faker";

interface TestUser {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
}

interface Fixture {
  adminPage: Page;
  registeredUser: TestUser;
  apiContext: APIRequestContext;
}

const adminStorage = "test-data/auth/admin.json";

export const test = base.extend<Fixture>({
  adminPage: async ({ browser }, use) => {
    const page = await browser.newPage({ storageState: adminStorage });
    await use(page);
  },

  apiContext: async ({ playwright }, use) => {
    const apiContext = await createApiContext(playwright);
    await use(apiContext);
    await apiContext.dispose();
  },

  registeredUser: async ({ apiContext }, use) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const password = "test";

    // Register user
    await registerApi(apiContext, {
      firstName,
      lastName,
      email,
      password,
    });

    let token: string | undefined;

    // Confirm registration
    await expect(async () => {
      try {
        token = await getTokenApi(apiContext, email);
      } catch {
        // Empty to just rerun getTokenApi
      }
      expect(token).toBeDefined();
    }).toPass();

    await registerConfirmationApi(apiContext, token!);
    await use({ firstName, lastName, email, password });
  },
});

export { expect } from "@playwright/test";
