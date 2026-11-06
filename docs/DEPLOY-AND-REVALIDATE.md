# Deploying this branch and wiring instant publish

## 1. Preview only — nothing goes to production

This work lives on `redesign/kinetic-2026`. Pushing the branch gives you a Vercel **preview deployment** automatically; production (`main`) is untouched until you merge the PR. Review the preview URL on your phone and desktop, leave comments on the PR, and merge when you're happy.

## 2. Environment variables in Vercel

Project → Settings → Environment Variables. Set each for **Production and Preview**:

| Name                    | Value                                       | Notes                                                                                             |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `WORDPRESS_GRAPHQL_URL` | `https://cms.everydaydigital.co.nz/graphql` | Already set                                                                                       |
| `NEXT_PUBLIC_SITE_URL`  | `https://everydaydigital.co.nz`             | Already set. Preview deployments can leave this as production — it only affects canonical/OG URLs |
| `REVALIDATE_SECRET`     | output of `openssl rand -hex 32`            | **New.** Same value goes into WordPress below                                                     |

Redeploy after adding `REVALIDATE_SECRET` so the route picks it up.

## 3. WordPress side (Cloudways)

1. SFTP/SSH to the `cms.everydaydigital.co.nz` application.
2. Create `wp-content/mu-plugins/` if it doesn't exist.
3. Upload `wpTheme/mu-plugins/edd-revalidate.php` from this repo into it. Must-use plugins activate automatically and can't be switched off by accident.
4. Edit `wp-config.php`, above `/* That's all, stop editing! */`:

```php
define( 'EDD_REVALIDATE_URL',    'https://everydaydigital.co.nz/api/revalidate' );
define( 'EDD_REVALIDATE_SECRET', 'paste-the-same-secret-here' );
// Optional while testing — also ping the preview deployment:
// define( 'EDD_REVALIDATE_PREVIEW_URL', 'https://everyday-digital-git-redesign-kinetic-2026-<team>.vercel.app/api/revalidate' );
```

5. In wp-admin, edit any published project and click **Update**. Then:
   - Tools → Site Health → Info → **EDD Revalidate** shows the last ping and its HTTP status.
   - The admin bar now has **↻ Refresh live site**, which purges everything on demand.

## 4. What happens on publish

```
WP "Publish"/"Update"/"Trash"
  → transition_post_status / trashed_post hook
  → POST /api/revalidate  { type: "project", slug: "plow-foods" }
  → Next.js revalidateTag("wp:projects") + revalidatePath("/projects/plow-foods")
  → next request for that page is rebuilt from fresh WordPress data
```

Covered post types: `post`, `page`, `project`, `service`, `team`, `testimonial`. Menu changes also trigger a full purge.

Fallback: every fetch still has a 24-hour revalidation, so a missed webhook can never leave stale content up for more than a day. (Previously the site re-fetched every 60 seconds whether or not anything changed.)

## 5. Testing the route by hand

```bash
curl -X POST https://everydaydigital.co.nz/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type":"project","slug":"plow-foods"}'
# → {"ok":true,"revalidated":["wp:projects"],"paths":["/","/sitemap.xml","/projects/plow-foods"],...}
```

A wrong secret returns 401. A missing env var returns 500 with a clear message.

## 6. Local development

```bash
cp .env.example .env.local   # fill in values
pnpm install
pnpm dev
```

`scripts/capture-screenshots.mjs` needs `pnpm exec playwright install chromium` once, then `node scripts/capture-screenshots.mjs` writes the four work-tile PNGs to `public/images/work/`. Commit them.

## 7. Before merging to main — checklist

- [ ] `REVALIDATE_SECRET` set in Vercel (Production + Preview)
- [ ] mu-plugin installed on Cloudways with matching constants; Site Health shows an `ok` ping
- [ ] Real screenshots committed to `public/images/work/`
- [ ] `XX`/`null` result fields in `lib/site.ts` filled or left `null` (null fields are hidden, `XX` strings are not — search for `XX`)
- [ ] Instagram URL in `lib/site.ts` confirmed or removed
- [ ] WordPress content reviewed page by page (Sam) — the branch doesn't change CMS content
- [ ] Google Search Console verified on the production domain
