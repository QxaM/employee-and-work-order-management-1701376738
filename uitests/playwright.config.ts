import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  maxFailures: 20,
  workers: process.env.CI ? 1 : 5,
  reporter: [process.env.CI ? ["blob"] : ["html"], ["list"]],
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 60 * 1000,
  },

  use: {
    baseURL: "http://localhost:5173",
    launchOptions: {
      slowMo: 1000,
    },
    trace: "retain-on-first-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "setup",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/setup/*.setup.ts",
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: "**/setup/*",
      dependencies: ["setup"],
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: "**/setup/*",
      dependencies: ["setup"],
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: "**/setup/*",
      dependencies: ["setup"],
    },
  ],
});
