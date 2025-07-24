import {
  APIRequestContext,
  expect,
  Page,
  test as base,
} from "@playwright/test";
import { createApiContext } from "../utils/api.utils";
import { faker } from "@faker-js/faker";

interface TestUser {
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
    const email = faker.internet.email();
    const password = "test";

    // Register user
    const registerResponse = await apiContext.post(`/register`, {
      data: {
        email,
        password,
      },
    });
    expect(registerResponse.ok()).toBeTruthy();

    let token: string = "";

    // Confirm registration
    await expect(async () => {
      const response = await apiContext.get(`/qa/token`, {
        params: {
          email,
        },
      });
      expect(response.ok()).toBeTruthy();
      token = await response.text();
    }).toPass();

    const verificationResponse = await apiContext.post(`/register/confirm`, {
      params: {
        token,
      },
    });
    expect(verificationResponse.ok()).toBeTruthy();

    await use({ email, password });
  },
});

export { expect } from "@playwright/test";
