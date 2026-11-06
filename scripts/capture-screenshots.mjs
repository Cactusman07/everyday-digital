// Captures fresh screenshots of the four focal client sites for the work tiles
// and case-study heroes. Run locally:  node scripts/capture-screenshots.mjs
// Requires: pnpm exec playwright install chromium   (once)
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const SITES = [
  ["nz-in-pictures", "https://nzinpictures.co.nz"],
  ["ride-rotorua-store", "https://riderotoruastore.co.nz"],
  ["plow-foods", "https://plowfoods.co.nz"],
  ["home-office-space", "https://homeofficespace.co.nz"],
];

await mkdir("public/images/work", { recursive: true });
const browser = await chromium.launch();
for (const [slug, url] of SITES) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(1500);
    // Dismiss common cookie banners if present
    for (const sel of [
      'button:has-text("Accept")',
      'button:has-text("OK")',
      '[aria-label="Close"]',
    ]) {
      const b = page.locator(sel).first();
      if (await b.isVisible().catch(() => false))
        await b.click().catch(() => {});
    }
    await page.screenshot({
      path: `public/images/work/${slug}.png`,
      fullPage: false,
    });
    await page.screenshot({
      path: `public/images/work/${slug}-full.png`,
      fullPage: true,
    });
    console.log("captured", slug);
  } catch (e) {
    console.error("failed", slug, e.message);
  } finally {
    await page.close();
  }
}
await browser.close();
