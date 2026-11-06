# Every Day Digital — SEO, GEO & AEO audit

Date: 7 Nov 2026. Scope: everydaydigital.co.nz (Next.js 16 front end, headless WordPress on cms.everydaydigital.co.nz).

SEO = being found in Google/Bing. GEO = being cited by generative engines (ChatGPT, Perplexity, Gemini, Claude). AEO = being quoted as the direct answer (featured snippets, AI overviews). The same fixes serve all three; where they differ, it's noted.

Status key: **Done** = implemented in this branch. **Needs Sam** = requires live content, an account, or a decision. **Later** = worthwhile but not blocking.

---

## 1. What was wrong before this branch

| #   | Finding                                                                                                                                                          | Impact                                                       | Status                                                                                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 1   | Home page HTML body was empty (`page.tsx` returned `null`). Crawlers and AI engines saw a title and a rotating word.                                             | Critical — nothing to rank, nothing to cite                  | **Done** — full server-rendered home page                                                          |
| 2   | Title tag "Every Day Digital \| Your Digital Partner" has no service or location.                                                                                | High — the single strongest on-page signal was wasted        | **Done** — "Web Design, Development & Hosting in Auckland \| Every Day Digital"                    |
| 3   | Meta description was brand copy ("a digital studio that cares about you") with no services, prices or place.                                                     | High — low CTR from results                                  | **Done** — services, prices, Auckland                                                              |
| 4   | No prices anywhere indexable. Competitors (Apex, NZ Digital) publish ranges and rank for "how much does a website cost nz".                                      | High — missed the highest-intent queries                     | **Done** — pricing on page + `OfferCatalog` schema                                                 |
| 5   | No FAQ content. AI overviews and answer engines draw heavily on Q&A blocks.                                                                                      | High for AEO                                                 | **Done** — 7 FAQs + `FAQPage` schema                                                               |
| 6   | `Organization` schema only; no `LocalBusiness`, no address locality, no `areaServed`, no `founder`, no `priceRange`.                                             | High for local pack and "near me"                            | **Done** — `LocalBusiness` (ProfessionalService) with Auckland, areaServed NZ, founder, priceRange |
| 7   | No default Open Graph image. Shares on LinkedIn/Facebook showed a 500×500 logo or nothing.                                                                       | Medium — social CTR                                          | **Done** — `app/opengraph-image.tsx` generates a 1200×630 card                                     |
| 8   | No canonical URLs on any page.                                                                                                                                   | Medium — duplicate-content risk across `/about` vs `/about/` | **Done** — canonical on home, projects; template for others                                        |
| 9   | `og:locale` was `en_US` on a .co.nz site.                                                                                                                        | Low                                                          | Already `en_NZ` in layout — confirmed                                                              |
| 10  | robots.txt disallowed `/wp-admin/` and `/wp-content/` on the **Next.js** domain, where those paths don't exist. Harmless but signals copy-paste.                 | Low                                                          | **Done** — cleaned; AI crawler policy added                                                        |
| 11  | No `llms.txt`. Generative engines increasingly read this for a plain-language site summary.                                                                      | Medium for GEO                                               | **Done** — `/llms.txt` route, generated from `lib/site.ts`                                         |
| 12  | No `BreadcrumbList` schema on inner pages.                                                                                                                       | Low-medium                                                   | **Done** — on project pages; template for services/blog                                            |
| 13  | Project pages had no structured facts (client, sector, stack, result). Case studies are what AI engines cite when asked "who builds Shopify stores in Auckland". | High for GEO                                                 | **Done** — four focal case studies with `CreativeWork` schema                                      |
| 14  | Sitemap gave no `lastModified` for pages/services and no priority differentiation for the four focal projects.                                                   | Low                                                          | **Done** — focal projects priority 0.8                                                             |
| 15  | H1 is the animated "Every Day Digital" + rotating word. Fine for brand, but the page had no H2s at all.                                                          | Medium                                                       | **Done** — H2 per section, H3 per service/project                                                  |
| 16  | Testimonials rendered with `line-clamp: 5` and were clamped in the DOM text? No — CSS only, text is complete.                                                    | None                                                         | Confirmed OK                                                                                       |
| 17  | ISR at 60 s meant up to 1,440 origin fetches/day per page with no benefit.                                                                                       | Perf, not SEO                                                | **Done** — on-demand revalidation, 24 h fallback                                                   |

## 2. Needs Sam (can't be done from the codebase)

| #   | Action                                                                                                                                                                  | Why                                                                                                                                | Effort         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| A   | **Google Business Profile**: claim/verify, category "Website Designer" + "Software Company", Auckland service area, photos, hours. Link review URL from the footer.     | Local pack is where "web designer auckland" enquiries come from. Every competitor in the review has one; Harper shows 166 reviews. | 1 hr + ongoing |
| B   | **Google Search Console + Bing Webmaster**: verify the Next.js domain (not just the CMS), submit `/sitemap.xml`.                                                        | Can't measure what isn't verified. Bing feeds Copilot/ChatGPT search.                                                              | 20 min         |
| C   | **Fill the `null` result fields** in `lib/site.ts` (orders, load time, hours saved).                                                                                    | Numbers are what get quoted. A case study with no number is a brochure.                                                            | 30 min         |
| D   | **Add `timeline`** to each case study ("3 weeks design-to-launch").                                                                                                     | AI engines answer "how long does a website take" from case-study timelines.                                                        | 10 min         |
| E   | **Expand WordPress project content** for the four focal clients using the What/How/Timeline structure — the page already renders WP content below the structured facts. | Depth signals expertise; this is the E-E-A-T lever.                                                                                | 2–3 hrs        |
| F   | **About page**: photo of Sam, 150 words on background, LinkedIn link. Add `Person` schema with `sameAs` → LinkedIn.                                                     | "Experience" in E-E-A-T. AI engines prefer citing named people.                                                                    | 45 min         |
| G   | **Instagram URL**: `lib/site.ts` has a placeholder (`everydaydigitalnz`). Confirm or remove.                                                                            | Wrong `sameAs` is worse than none.                                                                                                 | 2 min          |
| H   | **Run `scripts/capture-screenshots.mjs`** locally and commit the four PNGs.                                                                                             | Placeholder tiles are live until then.                                                                                             | 5 min          |
| I   | **Set `REVALIDATE_SECRET`** in Vercel (Production + Preview) and install `wpTheme/mu-plugins/edd-revalidate.php` on Cloudways with matching constants.                  | Instant publish.                                                                                                                   | 15 min         |
| J   | **Decide on AI crawlers** (see §4). Default in this branch: allow all.                                                                                                  | Business decision.                                                                                                                 | 5 min          |

## 3. Keyword targets (write service pages toward these)

Low competition, high intent — nobody in the ten-site competitor set targets them:

- `shopify xero integration nz` · `woocommerce xero integration`
- `website audit nz` · `seo audit auckland` (the $1,500 product)
- `shopify developer auckland` · `woocommerce developer auckland`
- `business automation auckland` · `automate xero invoicing`
- `nz data residency web hosting` · `private web hosting nz`
- `website migration wix to shopify nz`

Then the competitive heads: `web design auckland` · `wordpress developer auckland` · `ecommerce website design nz` · `how much does a website cost nz`.

Each service page should answer its query in the first 60 words, carry a price, and link to one case study.

## 4. AI crawler policy

Options, and what each means:

1. **Allow all** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot, CCBot). Maximises chance of being cited when someone asks an AI "who should build my Shopify store in Auckland". This is the default in this branch.
2. **Allow search, block training** (allow PerplexityBot, OAI-SearchBot, ClaudeBot; block GPTBot, Google-Extended, CCBot). Cited in answers, not used to train models.
3. **Block all AI.** Not recommended for a service business — invisible to the fastest-growing discovery channel.

For a business that wants to be recommended, option 1 or 2. `app/robots.ts` has both written; one is commented out.

## 5. Later (worthwhile, not blocking)

- **Service landing pages** at `/services/hosting`, `/services/web-design`, `/services/development`, `/services/automation` with their own metadata, `Service` + `Offer` schema, and FAQ. The home-page focus rows already link there; the pages exist in WP but need content toward §3.
- **Location page** `/web-design-auckland/` — thin pages are penalised, so only if it carries 600+ words of specific content (areas served, local clients, how to meet).
- **Blog cadence**: two posts a month toward §3 queries. `Article` schema is already in place; add `author` → `Person` once the About page exists.
- **Core Web Vitals**: the hero word-morph uses `filter: blur()` on a large text node every 2.5 s — that's a paint cost on low-end phones. Measure with PageSpeed Insights after deploy; if LCP/INP suffer, swap blur for opacity-only on `(prefers-reduced-motion)` and on small screens.
- **Image alt text** on WP uploads — currently many are empty strings.
- **Speakable schema** on the FAQ once Google extends support beyond news.
- **`hreflang`**: single-locale site, not needed. Don't add.

## 6. How to verify after deploy

1. `https://search.google.com/test/rich-results?url=https://everydaydigital.co.nz/` → expect FAQPage, LocalBusiness, OfferCatalog valid.
2. `https://validator.schema.org/` paste the home HTML.
3. `curl -s https://everydaydigital.co.nz/llms.txt` → plain-text summary.
4. `curl -s https://everydaydigital.co.nz/robots.txt` → AI policy present, sitemap line present.
5. Share the home URL in LinkedIn → 1200×630 card renders.
6. PageSpeed Insights mobile → aim LCP < 2.5 s, CLS < 0.1. The hero reserves width for the rotating word, so CLS should be fine.
