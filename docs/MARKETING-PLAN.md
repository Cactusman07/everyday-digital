# Every Day Digital — social and advertising plan

Date: 7 Nov 2026. Companion to `docs/SEO-GEO-AEO-AUDIT.md` and the three landing pages at `/lp/*`.

## What's changed since the 90-day plan

The 90-day plan's structure survives: four lists, five hours a week in fixed blocks, warm network before cold, and "kill three channels after 90 days and pour into the one that worked." Keep all of that.

What's different is the offer underneath it. You've moved from monthly retainers to **fixed-price packages** ($2,350 / $4,750 / $6,500 / $1,500 audit) with hosting at $30/month and everything else at $140/hour. That changes the outreach in one useful way: every message can now carry a price, which is the single biggest reply-rate lever in cold or warm outreach. "Would you like a chat about your website" gets ignored. "A custom-designed business website is $2,350, here's one we did" gets a yes or a no.

The plan's "stop selling websites, sell running stores" line is now partly wrong for the business you've described — you're explicitly selling websites, design, development and automation, not store-running. But the plan's _reason_ for that line still holds: "web design and development" is the most crowded sentence in the market. The way through isn't to narrow to one vertical; it's to be **specific and priced** where everyone else is vague. The home page now does that.

## Channels, in priority order

### 1. The four lists (direct outreach) — primary

This is still where the first ten clients come from. Nothing below replaces it; everything below feeds it.

| List                             | Who                                                                                    | Message                                                                                                                                                                | Landing page                          |
| -------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| A — already paid you             | Every past client                                                                      | "I've repriced everything into fixed packages. Your site is on $X hosting; here's what's included now, and here's the $1,500 audit if you want to know what it needs." | `/` (pricing anchor)                  |
| B — warm network                 | Ex-colleagues, Plow Foods suppliers/distributors/retailers, Home Office Space contacts | "I build websites and automation for NZ businesses. Here's the price list. If your site is more than three years old, the audit is the place to start."                | `/lp/seo-audit`                       |
| C — referral partners            | Marketing/brand studios without dev, accountants, business advisors                    | "White-label or 10% referral — your choice. Fixed prices so you can quote your client without calling me."                                                             | `/` + a one-page PDF of the packages  |
| D — stores with fixable problems | NZ Shopify/Woo stores that are slow, broken on mobile, or abandoned                    | "Your store [specific thing]. I run one myself, so I know what that costs you. $6,500 rebuilds it, or $1,500 tells you exactly what's wrong first."                    | `/lp/shopify-6500` or `/lp/seo-audit` |

Cadence from the plan: Mon 90 min send ten, Wed 60 min follow up, Thu 60 min one call or coffee. Keep it.

### 2. LinkedIn — where the buyers are

Business owners and managers who approve a $4,750 website are on LinkedIn, not Instagram. This is the only social channel that earns original effort.

**Personal profile (Sam) — fix first, matters more than the company page.**

- Headline: `Web design, development & automation for NZ businesses · WordPress · Shopify · Custom apps · Founder, Every Day Digital`
- About: three short paragraphs — what you build, who for, the fact you run two businesses yourself. End with the price list in one line and a link.
- Featured: the home page, one case study, `/lp/seo-audit`.
- Experience: Every Day Digital entry rewritten to the four focus areas. Plow Foods GM and Home Office Space listed — they're credentials, not distractions.

**Company page.** Tagline = "We keep you running. Web design, development, hosting and automation for NZ businesses." Pin the pricing post. Logo and banner from the OG image.

**Cadence: one post a week, Tuesday–Thursday morning NZT.** Four pillars, rotate:

| Week | Pillar                  | Example                                                                                                                 | Links to                |
| ---- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 1    | Price transparency      | "Here's exactly what a website costs from us, and why we publish it." Screenshot of the packages section.               | `/#pricing`             |
| 2    | Case study              | One client, one problem, one result, two screenshots. Start with Home Office Space or Plow Foods — you own the numbers. | `/projects/<slug>`      |
| 3    | Build note              | A screenshot of something shipped this week and two sentences on why. Automation wins work best here.                   | none, or the case study |
| 4    | Plain-English explainer | "Shared hosting vs private hosting, and which one you actually need." "What an SEO audit finds that you can't see."     | `/lp/seo-audit`         |

**The daily ten minutes.** Comment on three posts from NZ business owners, Xero advisors, Shopify partners, or the Plow Foods/food-industry network. Specific, useful, no pitch. This is where the DMs come from, and it costs less than a post.

**Do not** post the hero animation as a video; it reads as a design studio, not a business partner. Post screenshots of real work.

### 3. Facebook — proof of life, not a channel

The page exists and is linked from the site. Keep it alive at zero marginal cost: the LinkedIn post, reposted. Every Google review, reposted with a thank-you.

Where Facebook _does_ earn effort: **local business groups** (Auckland business owner groups, NZ small business groups, the Shopify NZ community). Answer questions about hosting, speed, and "my website person disappeared." Don't pitch; put the site link in your profile. One or two useful answers a week.

### 4. Instagram — only if visual, otherwise park it

For a web/dev business Instagram converts poorly unless the feed is visual and consistent. Two honest options:

- **Park it properly**: a clean profile, bio with the one-liner and link, nine posts of work screenshots so it isn't empty, then leave it. An abandoned feed is worse than a static one.
- **Run it via Home Office Space's automation**: you already have the Logic App posting HOS products daily. Adapt it to post EDD work tiles on a schedule — one carousel a week built from the case-study screenshots. Zero manual effort once set up, and it's a live demo of the automation service.

The second is better and it's a story: "our Instagram is run by the same automation we sell."

## Paid — small, measured, tied to the landing pages

Paid is a multiplier on proof, not a substitute for it. **Don't start paid until the four case studies have real numbers and screenshots** (the `XX` placeholders are still in `lib/site.ts`). Ads to a page with placeholder images waste money.

Once that's done, two tests, four weeks each, NZ-realistic budgets:

### Google Search — intent capture

|                   |                                                                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Budget            | $20/day ($600/month) for the test                                                                                                                                                  |
| Campaign 1        | "website audit" terms → `/lp/seo-audit`. Keywords: `website audit nz`, `seo audit auckland`, `why is my website slow`, `website not showing on google`. Exact + phrase match only. |
| Campaign 2        | "website cost" terms → `/lp/website-2350`. Keywords: `website design cost nz`, `how much does a website cost nz`, `small business website auckland`.                               |
| Negative keywords | `free`, `template`, `wix`, `squarespace`, `course`, `job`, `diy`, `tutorial`                                                                                                       |
| Location          | Auckland + 50 km, then NZ-wide if CPL is good                                                                                                                                      |
| Ad copy           | Lead with the price. "Website audit — $1,500. Every issue listed, first 4 hours fixed." Price in the headline filters out the tyre-kickers before they cost you a click.           |
| Success           | Cost per enquiry under $150 on the audit page; under $250 on the website page. If it's double that after four weeks, stop.                                                         |

Why audit first: it's the lowest-commitment purchase, it's a product no competitor in the review set sells as a fixed price, and every audit is a scoped pipeline into a $2,350–$6,500 build.

### Meta (Facebook/Instagram) — retargeting only

|          |                                                                                                                                                          |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Budget   | $8/day ($240/month)                                                                                                                                      |
| Audience | Website visitors last 30 days, plus LinkedIn/Facebook page engagers. **No cold interest targeting** — for a B2B service at this budget it won't convert. |
| Creative | The case-study tiles as a carousel; the pricing section as a single image. Copy = one line + price.                                                      |
| Landing  | Whichever `/lp/*` matches the creative                                                                                                                   |
| Success  | Any enquiry at under $100. This is cheap insurance that someone who read the pricing page and left sees you again.                                       |

### LinkedIn Ads — don't, yet

Minimums and CPCs ($8–15/click in NZ) make it the wrong first paid channel for a solo operator. Revisit if the organic LinkedIn post cadence produces leads and you want to scale that specific content.

### Measurement

- Install the Meta pixel and Google Ads tag via GTM in `app/layout.tsx` (there's already Vercel Analytics; GTM slots in beside it).
- Formspree already receives a hidden `context` field: `lp:<slug> | utm_source=… | utm_campaign=…`. Every enquiry email tells you which page and which campaign produced it. Read that before you read any ad dashboard.
- Vercel Analytics gives you page views per `/lp/*` for free.
- Monthly: enquiries per channel, cost per enquiry, enquiries → quotes → paid. Three numbers. If a channel can't produce a line on that table after 60 days, it's not a channel.

## Eight weeks, in order

| Weeks | Do                                                                                                                                                                                                                                         | Output                                                     |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| 1–2   | Merge the preview after review. Fill the `XX` numbers in `lib/site.ts`. Run `scripts/capture-screenshots.mjs`. Set up Google Business Profile and Search Console. Rewrite LinkedIn personal profile. **Email List A with the new prices.** | Site live with real proof; first replies from past clients |
| 3–4   | List B — 40 messages. First four LinkedIn posts (one per pillar). Install GTM + Meta pixel. Park or automate Instagram.                                                                                                                    | Warm pipeline; a month of posts to point people at         |
| 5–6   | List C — 20 agencies, 10 advisors, aim for five conversations. One-page packages PDF. Start Google Search test (audit campaign only).                                                                                                      | Referral conversations; first paid data                    |
| 7–8   | List D — first ten specific-problem store messages. Add the second Google campaign. Start Meta retargeting. Review: which of the four lists produced quotes?                                                                               | Decide what to double down on for the next quarter         |

**If you only do one thing:** week 1, email everyone who has already paid you, with the new price list attached. Same as the plan said. Still true.

## Things not to do

- Don't run ads to the home page. It has six things on it; an ad needs a page with one.
- Don't post on four platforms. One post, written for LinkedIn, repurposed elsewhere.
- Don't buy a Google Partner badge or a review-generation tool. You don't manage ad spend and you have real clients who'll leave real reviews if asked.
- Don't start a newsletter yet. No list, no cadence, and you're already at five hours a week.
- Don't let the `XX` placeholders go live. A case study with no number is a brochure; a brochure with a placeholder is worse.
