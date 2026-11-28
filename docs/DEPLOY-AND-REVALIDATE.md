# Deploying and instant publish

The site deploys from `main` on Vercel. Every pull request gets its own preview deployment. WordPress (cms.everydaydigital.co.nz on Cloudways) tells the site when content changes, so edits are live on the next request.

## 1. Environment variables in Vercel

Project → Settings → Environment Variables. Set each for **Production and Preview**, then redeploy so the change takes effect.

| Name                                   | Value                                       | Notes                                                                                  |
| -------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| `WORDPRESS_GRAPHQL_URL`                | `https://cms.everydaydigital.co.nz/graphql` |                                                                                        |
| `NEXT_PUBLIC_SITE_URL`                 | `https://everydaydigital.co.nz`             | Previews can keep the production value. It only sets canonical, sitemap and share URLs |
| `REVALIDATE_SECRET`                    | output of `openssl rand -hex 32`            | Same value goes in WordPress as `EDD_REVALIDATE_SECRET`                                |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console token                        | Optional. Adds the verification meta tag                                               |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | Bing Webmaster token                        | Optional. Adds the verification meta tag                                               |

The social posting variables are in [SOCIAL-AUTOMATION.md](SOCIAL-AUTOMATION.md).

## 2. WordPress must-use plugins

The plugins live in `wpTheme/mu-plugins/`:

- `edd-common.php`: shared helpers. Does nothing on its own, but the other two load it, so it **must** be uploaded with them. Without it WordPress stops with a fatal error.
- `edd-revalidate.php`: pings the site when content changes.
- `edd-social.php`: shares new posts and projects (see [SOCIAL-AUTOMATION.md](SOCIAL-AUTOMATION.md)).

To install:

1. SFTP/SSH to the `cms.everydaydigital.co.nz` application.
2. Create `wp-content/mu-plugins/` if it doesn't exist.
3. Upload all three files into it. Must-use plugins load automatically and can't be switched off by accident.
4. Edit `wp-config.php`, above `/* That's all, stop editing! */`:

```php
define( 'EDD_REVALIDATE_URL',    'https://everydaydigital.co.nz/api/revalidate' );
define( 'EDD_REVALIDATE_SECRET', 'same value as REVALIDATE_SECRET in Vercel' );
// Optional: also ping a preview deployment while testing
// define( 'EDD_REVALIDATE_PREVIEW_URL', 'https://<preview-deployment>.vercel.app/api/revalidate' );
```

5. In wp-admin, update any published project, then check Site Health (section 5).

## 3. What happens on publish

```
WP Publish / Update / Unpublish / Trash / Restore, or deleting a published item
  → transition_post_status / before_delete_post hook
  → POST /api/revalidate  { "all": false, "type": "project", "slug": "home-office-space" }
  → Next.js purges the wp:projects tag and the /, /sitemap.xml and /projects/home-office-space paths
  → the next request is rebuilt from fresh WordPress data
```

- One ping per change, to each configured target (production, plus preview if set). Draft-only edits are ignored.
- `type` is the canonical key: `post`, `page`, `project`, `service`, `team` or `testimonial`. The plugin maps WordPress's post types (`projects`, `services`, `testimonials`) to these.
- A trashed item still sends its real slug, so its live URL is purged.
- Pages also send their `uri`, e.g. `"uri": "/about/"`, and that path is purged.
- An unknown or missing `type` purges every tag. So does `{ "all": true }`, which is what the admin-bar **↻ Refresh live site** button sends.
- IndexNow (Bing and others) is told about the changed URLs in production only, and only for a typed change.
- Menu changes don't ping anything. The site's menu is built from the published pages, so publishing a page covers it.

Fallback: every WordPress fetch also refreshes at most every 5 minutes (`FALLBACK_REVALIDATE_SECONDS` in `lib/wordpress/client.ts`), so content still appears if a ping is missed.

## 4. Testing the route by hand

```bash
curl -X POST https://everydaydigital.co.nz/api/revalidate \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"type":"project","slug":"home-office-space"}'
# → {"ok":true,"revalidated":["wp:projects"],"paths":["/","/sitemap.xml","/projects/home-office-space"],"indexnow":200,"at":"…"}
```

Send `{"all":true}` to purge everything. `indexnow` is the IndexNow HTTP status, or `"skipped"` outside production or for a full purge. A wrong or missing secret returns 401. A missing `REVALIDATE_SECRET` env var returns 500.

## 5. Site Health

Tools → Site Health → Info → **EDD Revalidate** shows whether the constants are set, then one row per target (Production, and Preview if set) with the last ping: time, `ok` or the HTTP status, type and slug, and the start of the response. Failures are also written to the PHP error log.

## 6. Local development

```bash
cp .env.example .env.local   # fill in values
pnpm install
pnpm wp:start                # WordPress on http://localhost:8181
pnpm dev                     # site on http://localhost:3000
```

Docker mounts `wpTheme/` as the theme and `wpTheme/mu-plugins/` at `wp-content/mu-plugins`, so local WordPress runs the same plugins. They do nothing until their wp-config constants are set. First-time WordPress setup (WPGraphQL, activating the theme) is in the README.

## 7. Work screenshots

The case-study tiles use `public/images/work/<slug>.png`. To refresh them:

```bash
pnpm exec playwright install chromium   # once
node scripts/capture-screenshots.mjs
```

This captures the three public sites. The Plow Foods portal is behind a login, so its image is made by hand. `lib/site.test.ts` fails if a case study has no screenshot. Commit the PNGs.

## Production checklist

- [ ] `REVALIDATE_SECRET` set in Vercel (Production + Preview)
- [ ] All three mu-plugins on Cloudways with matching constants; Site Health shows an `ok` ping
- [ ] Google Search Console and Bing Webmaster verified on the production domain
