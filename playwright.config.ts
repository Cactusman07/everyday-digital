import { defineConfig } from "@playwright/test";

const CI = !!process.env.CI;

// The site runs against a mock WordPress (scripts/mock-wordpress.mjs) so the
// tests don't depend on the live CMS. Both get their own ports, so an
// already-running dev server pointed at the real CMS is never reused.
const MOCK_WP_PORT = 4010;
const APP_PORT = 3456;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: CI ? [["list"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: `node scripts/mock-wordpress.mjs ${MOCK_WP_PORT}`,
      port: MOCK_WP_PORT,
      reuseExistingServer: false,
    },
    {
      // CI tests the production build; locally the dev server is quicker
      command: CI
        ? `pnpm run build && pnpm exec next start -p ${APP_PORT}`
        : `pnpm exec next dev -p ${APP_PORT}`,
      url: `http://localhost:${APP_PORT}`,
      env: {
        WORDPRESS_GRAPHQL_URL: `http://localhost:${MOCK_WP_PORT}/graphql`,
        NEXT_PUBLIC_SITE_URL: `http://localhost:${APP_PORT}`,
      },
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
