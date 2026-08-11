import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: { command: "npm run dev -- --port 8740", url: "http://localhost:8740", reuseExistingServer: true },
  use: { baseURL: "http://localhost:8740", trace: "retain-on-failure" },
  projects: [{ name: "mobile-chrome", use: { ...devices["Pixel 7"], channel: "chrome" } }, { name: "desktop-chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
});
