# Every Day Digital — Next.js + Headless WordPress

The website for [Every Day Digital](https://everydaydigital.co.nz): a server-rendered Next.js (App Router) site in TypeScript and Tailwind CSS, with WordPress as a headless CMS.

## Architecture

```
Browser → Next.js on Vercel → WPGraphQL on WordPress (cms.everydaydigital.co.nz)
```

- WordPress holds the content: pages, posts, projects, services, team and testimonials. It serves no front-end HTML.
- Next.js fetches it over WPGraphQL. Pages are pre-rendered and cached by content type.
- When content changes, a WordPress must-use plugin calls `/api/revalidate` and the change is live on the next request. A 5-minute timer is the fallback. See [docs/DEPLOY-AND-REVALIDATE.md](docs/DEPLOY-AND-REVALIDATE.md).
- New blog posts and projects are shared to Facebook, Instagram and LinkedIn by `/api/social`. See [docs/SOCIAL-AUTOMATION.md](docs/SOCIAL-AUTOMATION.md).

Each testimonial is linked to its project with the **Project** box in its WordPress editor; the site uses that link (never the names) to connect a quote to its case study.

Facts that need to be exact live in code under `lib/`: prices (`pricing.ts`), which price each service shows (`services.ts`), case studies, the FAQ, and contact details, the Calendly booking link and the founder's profile (`site.ts`). The founder's profile on the About page and under blog posts shows `FOUNDER.photo` (a square image in `public/`) when it's set, and his initials when it isn't.

## Prerequisites

- [Node.js](https://nodejs.org/) 22.12 or later (CI uses 24)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), for local WordPress
- PHP 7.4 or later on the WordPress host (the theme and mu-plugins need it; `lint:php` uses a local `php` if there is one)

## First-time setup

1. `pnpm install`
2. `cp .env.example .env.local` and fill in the values. To work against the live CMS instead of a local one, set `WORDPRESS_GRAPHQL_URL=https://cms.everydaydigital.co.nz/graphql` and skip steps 3–5.
3. `pnpm run wp:start` starts WordPress, MariaDB and phpMyAdmin. WordPress files are stored in `wordpress/`.
4. Open http://localhost:8181, run the installer, then install and activate the **WPGraphQL** plugin.
5. Under Appearance → Themes, activate **Every Day Digital**. It registers the Projects, Team, Services and Testimonials post types. The mu-plugins in `wpTheme/mu-plugins/` are mounted automatically.
6. `pnpm run dev` and open http://localhost:3000.

| Service    | URL                   |
| ---------- | --------------------- |
| Next.js    | http://localhost:3000 |
| WordPress  | http://localhost:8181 |
| phpMyAdmin | http://localhost:8180 |
| MariaDB    | localhost:3306        |

The ports are bound to `127.0.0.1`, so they aren't reachable from the rest of your network. WP-CLI runs on demand: `docker compose run --rm wordpress-cli wp <command>`.

## Scripts

| Script                | What it does                                                      |
| --------------------- | ----------------------------------------------------------------- |
| `pnpm run dev`        | Dev server with hot reload                                        |
| `pnpm run build`      | Production build                                                  |
| `pnpm start`          | Serve the production build on port 3000                           |
| `pnpm run lint`       | ESLint                                                            |
| `pnpm run lint:php`   | `php -l` on the WordPress theme and plugins (skipped without PHP) |
| `pnpm run typecheck`  | `next typegen` (route and image types), then `tsc --noEmit`       |
| `pnpm run format`     | Prettier, writing changes (`format:check` only reports)           |
| `pnpm test`           | Vitest unit tests (`test:watch` to re-run on save)                |
| `pnpm run test:e2e`   | Playwright smoke tests against a mock WordPress (no CMS needed)   |
| `pnpm run check`      | lint, lint:php, typecheck, test                                   |
| `pnpm run audit`      | `pnpm audit`; fails on any known vulnerability                    |
| `pnpm run audit:fix`  | Adds pnpm overrides for vulnerable dependencies, then installs    |
| `pnpm run tidy`       | audit:fix, audit, format, check (what the pre-commit hook runs)   |
| `pnpm run tidy:check` | audit, format:check, check (what CI runs, without writing files)  |
| `pnpm run update`     | Update every dependency to its latest version                     |
| `pnpm run wp:start`   | Start the WordPress containers                                    |
| `pnpm run wp:stop`    | Stop them (data is kept)                                          |
| `pnpm run wp:remove`  | Remove them (`wordpress/` and the database volume are kept)       |

## Quality checks

- **Pre-commit hook** (Husky): runs `pnpm run tidy`, and the commit fails if anything needs attention:
  - **Vulnerabilities:** a vulnerability that `audit:fix` can't fix.
  - **Dependency changes:** `audit:fix` changed `package.json`, `pnpm-workspace.yaml` or `pnpm-lock.yaml`. Review the new overrides, stage them and commit again.
  - **Checks:** a lint, type or test failure.

  Formatting fixes are re-staged automatically. If you staged part of a file with `git add -p`, the rest of that file is staged too.

- **CI** (`.github/workflows/ci.yml`): `tidy:check` and a production build on every push and pull request to `main`, plus the Playwright smoke tests against a production build. The build reads the CMS at the `WORDPRESS_GRAPHQL_URL` repository variable; the smoke tests use a mock WordPress (`scripts/mock-wordpress.mjs` with `e2e/fixtures/wordpress.json`), so the CMS's bot protection can't fail them.
- **Unit tests** sit next to the code they test (`*.test.ts`, `*.test.tsx`). They run in Node; a test that renders React starts with `// @vitest-environment jsdom`.
- **ESLint** includes the React Hooks and jsx-a11y rules, so missing alt text, unlabelled controls and broken hook dependencies fail the commit.

## Project structure

```
app/                       Routes (Next.js App Router)
  layout.tsx               HTML shell, fonts, background, site-wide schema
  (home)/                  Home page, with the full-screen hero layout
  (site)/                  Everything else, with the logo-and-menu layout:
    [slug]/                WordPress pages (about, services, projects, blog, contact, terms…)
    blog|projects|services/[slug]/
                           Detail pages and their share images (see lib/detail-routes.ts)
  lp/[slug]/               Landing pages for ads (lib/landing.ts); no site header
  api/revalidate/          On-demand cache purge, called by WordPress
  api/social/              Social posting, called by WordPress
  sitemap.ts, robots.ts, manifest.ts, feed.xml/, llms.txt/, llms-full.txt/, opengraph-image.tsx
  globals.css              Tailwind entry point; imports app/styles/ in cascade order
  styles/                  Site CSS: tokens, base, layout/, components/ and per-page files
components/
  layout/                  Header, hero, menu, footer, loading screen
  home/                    Home page sections and their scroll effects
  pages/                   WordPress page layout and its lists (services, projects, posts, team)
  showcase/                Blog post, project, service and case-study pages
  shared/                  Building blocks used across pages (testimonials, FAQ, contact form…)
  seo/                     JSON-LD structured data
lib/
  wordpress/               WPGraphQL client, queries, types, sanitising, content-type map
  detail-routes.ts         Shared logic for the blog, project and service routes
  site.ts                  Business identity and contact details
  pricing.ts               The published prices, and every sentence that quotes them
  services.ts, case-studies.ts, faq.ts, pages.ts, landing.ts, navigation.ts
  seo.ts, og.tsx, llms.ts  Page metadata, share images, llms.txt sections
  html.ts, dates.ts, testimonials.ts, brand.ts, scroll.ts, auth.ts, env.ts
  social/                  Captions and channel posting for /api/social
wpTheme/                   WordPress theme (post types) and mu-plugins (revalidate, social)
e2e/                       Playwright smoke tests and the mock WordPress fixture
scripts/                   Screenshot capture, PHP lint, mock WordPress for e2e
docs/                      Deployment, social automation, SEO audit, marketing plan
```

## SEO

- Server-rendered HTML with per-page titles, descriptions, canonical URLs and Open Graph cards. `lib/seo.ts` keeps site name, locale and share image on every page.
- A generated share image for every post, project and service.
- JSON-LD:
  - **Every page:** business (ProfessionalService/LocalBusiness), founder and website.
  - **Detail pages:** BlogPosting, CreativeWork for projects, Service with Offers.
  - **Listing pages:** Blog and CollectionPage.
  - **Also:** FAQPage, OfferCatalog and breadcrumbs.
- **Sitemap:** last-modified dates and images.
- **Machine-readable versions:** an RSS feed, `/llms.txt` and `/llms-full.txt` for AI assistants.
- **robots.txt:** blocks only `/api/` and sets an explicit AI-crawler policy.
- **IndexNow:** pinged when content changes.

The full audit is in [docs/SEO-GEO-AEO-AUDIT.md](docs/SEO-GEO-AEO-AUDIT.md).

## Accessibility

The site aims for WCAG 2.2 AA:

- A skip link to the main content and one `<main>` landmark per page.
- The menu is `inert` while closed. Open, it traps focus, closes on Esc and returns focus to its button.
- The team profiles open in a native `<dialog>`.
- Visible focus rings, text contrast of at least 4.5:1, and no animation for visitors who ask for reduced motion (including the hero's word cycle, which can also be paused).
- Form errors and success messages are announced to screen readers.

## Security

`next.config.ts` sends baseline security headers on every response: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and a `Permissions-Policy`. There is no Content Security Policy yet. The two webhook routes check a bearer secret in constant time (`lib/auth.ts`) and refuse every request when their secret isn't set.
