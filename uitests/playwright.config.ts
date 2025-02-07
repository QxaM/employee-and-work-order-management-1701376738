import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 1 : 6,
  reporter: [["html"], ["list"]],
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 60 * 1000,
  },

  use: {
    baseURL: "http://localhost:5173",
    launchOptions: {
      slowMo: 100,
    },
    trace: "retain-on-first-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
