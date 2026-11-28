import { expect, test } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("home page renders the hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Every Day/);
    await expect(page.locator("h1").first()).toContainText("Every Day");
  });

  test("menu opens and lists the pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.locator("#navMenu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /services/i })).toBeVisible();
  });

  test("a team profile opens in a dialog and Escape closes it", async ({
    page,
  }) => {
    await page.goto("/about");
    const card = page.getByRole("button", { name: /Test Person/ });
    await card.click();
    const dialog = page.getByRole("dialog", { name: "Test Person" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(card).toBeFocused();
  });

  test("unknown routes get the 404 page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-12345");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  });

  test("sitemap.xml lists the site", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("<urlset");
  });

  test("robots.txt points at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("User-Agent");
    expect(text).toContain("Sitemap:");
  });
});
