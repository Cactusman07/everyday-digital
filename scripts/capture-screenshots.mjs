// Captures fresh screenshots of the featured client sites for the work tiles
// and case-study heroes (public/images/work/<slug>.png).
//
//   pnpm exec playwright install chromium   # once
//   node scripts/capture-screenshots.mjs
//
// Slugs match lib/case-studies.ts; lib/site.test.ts fails if a case study has
// no screenshot. The Plow Foods portal is behind a login, so its image and the
// masked portal screenshots in public/images/work/plow-foods-portal/ (used in
// the WordPress project content) are made by hand.

import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const SITES = [
  ["nz-in-pictures", "https://nzinpictures.co.nz"],
  ["ride-rotorua-store-website", "https://riderotoruastore.co.nz"],
  ["home-office-space", "https://homeofficespace.co.nz"],
];

/** Buttons that commonly dismiss cookie banners. */
const DISMISS = [
  'button:has-text("Accept")',
  'button:has-text("OK")',
  '[aria-label="Close"]',
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
    for (const selector of DISMISS) {
      const button = page.locator(selector).first();
      if (await button.isVisible().catch(() => false))
        await button.click().catch(() => {});
    }
    await page.screenshot({ path: `public/images/work/${slug}.png` });
    console.log("captured", slug);
  } catch (e) {
    console.error("failed", slug, e.message);
  } finally {
    await page.close();
  }
}
await browser.close();
