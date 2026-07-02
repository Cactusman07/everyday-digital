import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("home page loads with title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Every Day/);
  });

  test("home page renders hero heading", async ({ page }) => {
    await page.goto("/");
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Every Day");
  });

  test("navigation menu opens and contains links", async ({ page }) => {
    await page.goto("/");
    const hamburger = page.locator("#menu button, #menu [role='button']").first();
    if (await hamburger.isVisible()) {
      await hamburger.click();
      const nav = page.locator("#navMenu");
      await expect(nav).toBeVisible();
    }
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-12345");
    expect(response?.status()).toBe(404);
    await expect(page.locator("text=Page Not Found")).toBeVisible();
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain("urlset");
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("User-Agent");
    expect(text).toContain("sitemap");
  });
});
