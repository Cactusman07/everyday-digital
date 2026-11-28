# Every Day Digital — SEO, GEO & AEO audit

Date: 7 Nov 2026, updated 28 Nov 2026. Scope: everydaydigital.co.nz (Next.js 16 front end, headless WordPress on cms.everydaydigital.co.nz).

SEO = being found in Google/Bing. GEO = being cited by generative engines (ChatGPT, Perplexity, Gemini, Claude). AEO = being quoted as the direct answer (featured snippets, AI overviews). The same fixes serve all three; where they differ, it's noted.

Status key: **Done** = in the codebase. **Needs Sam** = requires live content, an account, or a decision. **Later** = worthwhile but not blocking.

---

## 1. Findings and fixes

| #   | Finding                                                                                                                                                       | Impact                                                       | Status                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Home page HTML body was empty (`page.tsx` returned `null`). Crawlers and AI engines saw a title and a rotating word.                                          | Critical — nothing to rank, nothing to cite                  | **Done** — full server-rendered home page                                                                                                                                                                                       |
| 2   | When Vercel regenerated the cached home page, the router reported its path as `/index`, so the served HTML had no hero and no `<h1>` until JavaScript loaded. | High — the home page lost its H1                             | **Done** — the home hero now comes from its own route-group layout, so it no longer depends on the pathname                                                                                                                     |
| 3   | Title tag "Every Day Digital \| Your Digital Partner" had no service or location.                                                                             | High — the strongest on-page signal was wasted               | **Done** — "Web Design, Development & Hosting in Auckland \| Every Day Digital"                                                                                                                                                 |
| 4   | Meta description was brand copy with no services, prices or place. Descriptions were also cut mid-word.                                                       | High — low CTR from results                                  | **Done** — services, price, Auckland; descriptions cut at a word boundary with an ellipsis                                                                                                                                      |
| 5   | No prices anywhere indexable. Competitors publish ranges and rank for "how much does a website cost nz".                                                      | High — missed the highest-intent queries                     | **Done** — pricing section (`/#pricing`) and `OfferCatalog` schema, all from `lib/pricing.ts`                                                                                                                                   |
| 6   | No FAQ content. AI overviews and answer engines draw heavily on Q&A blocks.                                                                                   | High for AEO                                                 | **Done** — 7 FAQs (`lib/faq.ts`) + `FAQPage` schema                                                                                                                                                                             |
| 7   | `Organization` schema only, as separate nodes: no `LocalBusiness`, locality, `areaServed`, founder or `priceRange`. Listing pages had no schema.              | High for local pack and "near me"                            | **Done** — layout emits one `@graph`: `ProfessionalService`/`LocalBusiness` (Auckland, NZ, `priceRange`), founder `Person` with `sameAs`, and website. Listing pages get `Blog`, `CollectionPage`, `AboutPage` or `ContactPage` |
| 8   | Service pages had no structured offer.                                                                                                                        | Medium                                                       | **Done** — `Service` + `Offer` schema (`serviceOffers` in `components/seo/JsonLd.tsx`)                                                                                                                                          |
| 9   | Project pages had no structured facts. Case studies are what AI engines cite when asked "who builds Shopify stores in Auckland".                              | High for GEO                                                 | **Done** — `CreativeWork` on every project; the four case studies carry client, sector, stack and results                                                                                                                       |
| 10  | Page metadata replaced the layout's Open Graph object, so most pages had no `og:type`, `og:site_name`, `og:locale` (`en_NZ`) or share image.                  | Medium — social CTR                                          | **Done** — `pageMetadata()` in `lib/seo.ts` builds every page's metadata; posts and projects get `article:*` dates, section and tags                                                                                            |
| 11  | No default Open Graph image. Shares showed a 500×500 logo or nothing.                                                                                         | Medium — social CTR                                          | **Done** — `app/opengraph-image.tsx` generates a 1200×630 card; posts, projects and services have their own                                                                                                                     |
| 12  | No canonical URLs.                                                                                                                                            | Medium — duplicate-content risk across `/about` vs `/about/` | **Done** — every page, via `pageMetadata()`                                                                                                                                                                                     |
| 13  | No `BreadcrumbList` schema on inner pages.                                                                                                                    | Low-medium                                                   | **Done** — every detail and listing page                                                                                                                                                                                        |
| 14  | Sitemap had no `lastModified` for pages or services and no images; `changefreq`/`priority` are ignored by Google.                                             | Low                                                          | **Done** — every entry has a GMT `lastmod` (listing pages take their newest item's), posts and projects list their image, priorities removed                                                                                    |
| 15  | WPGraphQL list queries stopped at the first page of results, so the site saw at most 10 pages.                                                                | Medium — missing pages in menu and sitemap                   | **Done** — every list query follows the pagination cursor                                                                                                                                                                       |
| 16  | robots.txt disallowed `/wp-admin/` and `/wp-content/` on the Next.js domain, and blocked `/lp/`, so crawlers couldn't see those pages' `noindex`.             | Low                                                          | **Done** — only `/api/` is blocked; AI crawler policy added (§4)                                                                                                                                                                |
| 17  | No `llms.txt`, and no way for AI tools to read the full content in one request.                                                                               | Medium for GEO                                               | **Done** — `/llms.txt` (Markdown links, no trailing slashes) and `/llms-full.txt` (about, pricing, FAQ, every service, project and article)                                                                                     |
| 18  | Home page had no H2s.                                                                                                                                         | Medium                                                       | **Done** — H2 per section, H3 per service/project                                                                                                                                                                               |
| 19  | `everyday-digital.vercel.app` served an indexable copy of the site.                                                                                           | Medium — duplicate content                                   | **Done** — production redirects `*.vercel.app` to the real domain (except `/api/`)                                                                                                                                              |
| 20  | The CMS redirects old WordPress URLs like `/my-post/` to the front end, where they 404'd.                                                                     | Medium — lost links                                          | **Done** — `/[slug]` sends post, project and service slugs to `/blog/`, `/projects/` or `/services/` with a 308                                                                                                                 |
| 21  | Dates had no time zone.                                                                                                                                       | Low                                                          | **Done** — queries fetch WordPress's GMT dates; schema, sitemap and RSS mark them as UTC                                                                                                                                        |
| 22  | ISR at 60 s meant up to 1,440 origin fetches/day per page with no benefit.                                                                                    | Perf, not SEO                                                | **Done** — on-demand revalidation from WordPress, 5-minute fallback                                                                                                                                                             |

## 2. Needs Sam (can't be done from the codebase)

| #   | Action                                                                                                                                                                        | Why                                                                                                                                | Effort         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| A   | **Google Business Profile**: claim/verify, category "Website Designer" + "Software Company", Auckland service area, photos, hours. Link review URL from the footer.           | Local pack is where "web designer auckland" enquiries come from. Every competitor in the review has one; Harper shows 166 reviews. | 1 hr + ongoing |
| B   | **Google Search Console + Bing Webmaster**: verify the Next.js domain (not just the CMS), submit `/sitemap.xml`. The verification env vars are in `DEPLOY-AND-REVALIDATE.md`. | Can't measure what isn't verified. Bing feeds Copilot/ChatGPT search.                                                              | 20 min         |
| C   | **Fill the `null` `results` and `timeline` fields** in `lib/case-studies.ts` (orders, load time, hours saved; "3 weeks design-to-launch").                                    | Numbers are what get quoted, and AI engines answer "how long does a website take" from timelines. Null fields are hidden.          | 40 min         |
| D   | **Expand WordPress project content** for the four case studies using a What/How/Timeline structure. The page renders WP content below the structured facts.                   | Depth signals expertise; this is the E-E-A-T lever.                                                                                | 2–3 hrs        |
| E   | **About page and LinkedIn**: photo of Sam and 150 words on background in WordPress. Add Sam's personal LinkedIn URL to `FOUNDER.sameAs` in `lib/site.ts`.                     | "Experience" in E-E-A-T. AI engines prefer citing named people, and `sameAs` joins the profiles up.                                | 45 min         |
| F   | **Instant publish**: set `REVALIDATE_SECRET` in Vercel and install the three mu-plugins on Cloudways (see `DEPLOY-AND-REVALIDATE.md`).                                        | Edits go live straight away instead of within 5 minutes.                                                                           | 15 min         |
| G   | **Decide on AI crawlers** (see §4). Current setting: allow all.                                                                                                               | Business decision.                                                                                                                 | 5 min          |

## 3. Keyword targets (write service pages toward these)

Low competition, high intent — nobody in the ten-site competitor set targets them:

- `shopify xero integration nz` · `woocommerce xero integration`
- `website audit nz` · `seo audit auckland` (the website review)
- `shopify developer auckland` · `woocommerce developer auckland`
- `business automation auckland` · `automate xero invoicing`
- `nz data residency web hosting` · `private web hosting nz`
- `website migration wix to shopify nz`

Then the competitive heads: `web design auckland` · `wordpress developer auckland` · `ecommerce website design nz` · `how much does a website cost nz`.

Each service page should answer its query in the first 60 words, state its price or fixed-price quote, and link to one case study.

## 4. AI crawler policy

Options, and what each means:

1. **Allow all** (current). Every AI search and training crawler is allowed. Maximises the chance of being cited when someone asks an AI "who should build my Shopify store in Auckland".
2. **Allow search, block training.** Allow the search and assistant crawlers (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Applebot, Bingbot, DuckAssistBot); block the training crawlers (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, CCBot, meta-externalagent). Cited in answers, not used to train models.
3. **Block all AI.** Not recommended for a service business — invisible to the fastest-growing discovery channel.

For a business that wants to be recommended, option 1 or 2. `app/robots.ts` has both lists; option 2 is commented out beneath option 1.

## 5. Later (worthwhile, not blocking)

- **Service page content**: the service pages have their own metadata, price line and `Service` schema, but their WordPress content still needs writing toward §3.
- **Location page** `/web-design-auckland/` — thin pages are penalised, so only if it carries 600+ words of specific content (areas served, local clients, how to meet).
- **Blog cadence**: two posts a month toward §3 queries. `BlogPosting` schema with the founder as author is already in place.
- **Core Web Vitals**: the hero word-morph animates `filter: blur()` on a large text node every 2.5 s — a paint cost on low-end phones. Measure with PageSpeed Insights; if LCP/INP suffer, swap blur for opacity-only on `(prefers-reduced-motion)` and on small screens.
- **Image alt text** on WP uploads — many are empty strings.
- **Speakable schema** on the FAQ once Google extends support beyond news.
- **`hreflang`**: single-locale site, not needed. Don't add.

## 6. How to verify after deploy

1. `https://search.google.com/test/rich-results?url=https://everydaydigital.co.nz/` → expect FAQPage, LocalBusiness, OfferCatalog valid.
2. `https://validator.schema.org/` paste the home HTML.
3. `curl -s https://everydaydigital.co.nz/llms.txt` → Markdown summary linking to `/llms-full.txt`.
4. `curl -s https://everydaydigital.co.nz/robots.txt` → AI policy present, sitemap line present.
5. Share the home URL in LinkedIn → 1200×630 card renders.
6. PageSpeed Insights mobile → aim LCP < 2.5 s, CLS < 0.1.
