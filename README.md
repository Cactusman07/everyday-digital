# Every Day Digital — Next.js + Headless WordPress

A modern, server-rendered website for [Every Day Digital](https://everydaydigital.co.nz), built with Next.js (App Router), TypeScript, Tailwind CSS, and a headless WordPress backend served via Docker.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (included with Node.js)

---

## Architecture

Next.js runs as a standalone server on port 3000. WordPress runs in Docker as a headless CMS — content is managed in the WordPress admin and fetched via WPGraphQL at build time and on request (ISR with 60-second revalidation). WordPress no longer serves any frontend HTML.

```
Browser → Next.js (port 3000) → WordPress GraphQL API (port 8181)
```

---

## Local URLs

| Service    | URL                   |
| ---------- | --------------------- |
| Next.js    | http://localhost:3000 |
| WordPress  | http://localhost:8181 |
| phpMyAdmin | http://localhost:8180 |
| MariaDB    | localhost:3306        |

---

## First-Time Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start WordPress containers

```bash
npm run wp:start
```

This creates a `wordpress/` directory alongside `docker-compose.yml` where WordPress files are stored.

### 3. Fix Docker file permissions

Find and enter the WordPress container:

```bash
docker ps
docker exec -it <container_id> /bin/bash
chown -R root:root /var/www/html
exit
```

### 4. Complete WordPress installation

Navigate to **http://localhost:8181** and follow the setup wizard.

### 5. Install the WPGraphQL plugin

1. Log in at **http://localhost:8181/wp-admin**
2. Go to **Plugins → Add New**
3. Search for **WPGraphQL** and install + activate it

### 6. Activate the theme

1. Go to **Appearance → Themes**
2. Activate the **Starter Theme** (registers custom post types: Projects, Team, Services, Testimonials)

### 7. Start the Next.js dev server

```bash
npm run dev
```

Open **http://localhost:3000** — the site will hot-reload on file changes.

---

## Daily Development

```bash
npm run wp:start   # Start WordPress containers
npm run dev        # Start Next.js dev server
```

---

## Stopping & Removing Containers

```bash
npm run wp:stop    # Stop containers (preserves data)
npm run wp:remove  # Remove containers (preserves wordpress/ volume)
docker-compose down -v  # Remove everything including database volume
```

---

## Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start Next.js dev server with hot reload |
| `npm run build`      | Production build (SSG + ISR)             |
| `npm start`          | Serve production build on port 3000      |
| `npm run lint`       | Run Next.js ESLint                       |
| `npm test`           | Run Vitest test suite                    |
| `npm run test:watch` | Run Vitest in watch mode                 |
| `npm run test:e2e`   | Run Playwright E2E tests                 |
| `npm run wp:start`   | Start Docker containers                  |
| `npm run wp:stop`    | Stop Docker containers                   |
| `npm run wp:remove`  | Remove Docker containers                 |

---

## Testing

**Unit tests** use [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). **E2E tests** use [Playwright](https://playwright.dev/) against a running dev server.

Pre-commit hooks via [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) automatically run ESLint and related unit tests on every commit.

```bash
npm test           # Run unit tests once
npm run test:watch # Run unit tests in watch mode
npm run test:e2e   # Run E2E tests (starts dev server automatically)
```

---

## Project Structure

```
everyday-digital/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (HTML shell, nav, hero, SEO metadata)
│   ├── page.tsx                # Home page
│   ├── loading.tsx             # Route transition loading UI
│   ├── not-found.tsx           # 404 page
│   ├── globals.css             # Global styles + Tailwind
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── robots.ts               # robots.txt configuration
│   ├── [slug]/                 # Dynamic WordPress pages (about, blog, etc.)
│   ├── blog/[slug]/            # Individual blog posts
│   ├── projects/[slug]/        # Individual projects
│   └── services/[slug]/        # Individual services
├── components/                 # React components
├── lib/
│   ├── wordpress.ts            # GraphQL data-fetching functions
│   ├── queries.ts              # GraphQL query strings
│   └── types.ts                # TypeScript interfaces
├── hooks/                      # Custom React hooks
├── public/                     # Static assets (fonts, images)
├── wpTheme/                    # WordPress theme (custom post type registration)
├── docker-compose.yml          # WordPress + MariaDB + phpMyAdmin containers
├── next.config.ts              # Next.js configuration
├── e2e/                        # Playwright E2E tests
├── vitest.config.ts            # Unit test configuration
├── playwright.config.ts        # E2E test configuration
├── eslint.config.mjs           # ESLint configuration
└── tsconfig.json               # TypeScript configuration
```

---

## SEO

The site implements comprehensive SEO via the Next.js Metadata API:

- **Server-rendered HTML** — search engines see full page content, not an empty `<div>`
- **Per-page metadata** — title, description, Open Graph, and Twitter cards generated from WordPress content
- **Dynamic sitemap** — auto-generated from all WordPress pages, posts, projects, and services
- **robots.txt** — allows crawlers, blocks `/wp-admin/` and `/wp-content/`
- **JSON-LD structured data** — Organization, Article, and Service schemas
- **ISR (Incremental Static Regeneration)** — pages are statically generated and revalidated every 60 seconds

---

## Deployment

Next.js runs as its own server — it does **not** output a WordPress theme. For production:

```bash
npm run build   # Generates optimized static pages + server bundle
npm start       # Serves on port 3000
```

The build output lives in `.next/` (git-ignored). WordPress only needs to be reachable at the `WORDPRESS_GRAPHQL_URL` configured in `.env.local` for content fetching.
