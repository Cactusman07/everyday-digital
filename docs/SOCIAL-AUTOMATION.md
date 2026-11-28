# Automatic social posting

When a blog post or project is published for the first time in WordPress, it's
shared to the Every Day Digital Facebook Page, Instagram and LinkedIn company
page, with captions written by Claude from the item's own text.

```
WordPress "Publish"  (first time only, or when a scheduled post goes live)
  → EDD Social Share mu-plugin waits ~60 seconds (WP-Cron), then
  → POST https://everydaydigital.co.nz/api/social
      { type: "post" | "project", title, excerpt, text, url, image, tags }
  → Claude writes three captions (LinkedIn / Facebook / Instagram)
  → posts to each channel that's set up
  → result + captions saved on the WordPress item ("Share on social" box)
```

- **Test mode is on until you set `SOCIAL_LIVE=1`.** Captions are written and shown
  in the WordPress box, nothing is posted. Publish a test post, read the captions,
  then switch it on.
- `ANTHROPIC_API_KEY` is optional. Without it, or if Claude's call fails or
  declines, simple template captions (title, excerpt and link) are
  used, so posting never depends on the AI. `SOCIAL_MODEL` picks the model
  (default `claude-sonnet-5-5`).
- Untick **Share on social when published** in the editor to skip an item.
- **Share again now** in the same box re-sends an item straight away.
- Updates never re-post. Only blog posts and projects are shared.
- Each channel is optional: leave its variables out and it's skipped.
- Instagram needs a **JPEG** featured image (its API rejects PNG/WebP). Projects
  with a PNG screenshot are posted to Facebook and LinkedIn only.
- LinkedIn hashtags are real, clickable hashtags. The link preview uses the
  featured image only when it's hosted on the CMS.

## 1. Facebook: turn the profile into a Page

The current Facebook presence is a personal profile. Meta's API can only post to
**Pages**, and Meta's rules don't allow a business to run as a profile.

1. Log in to the profile, open the menu, and look for **"Create a Page from your
   profile"** (Meta has moved this a few times; searching Facebook Help for
   "convert profile to Page" finds the current link).
2. Pick up to three categories (e.g. Website Designer, Web Hosting Service,
   Software Company).
3. Choose which friends/followers to move across as Page followers, and which
   photos and videos to bring.
4. Submit. You end up with the new Page **and** a fresh personal profile that
   manages it. Check the Page's username (www.facebook.com/<username>) and, if
   it changes, update `SITE.social.facebook` in `lib/site.ts`.
5. Fill in the Page: About, services, website, phone, hours, and the same
   name/address/phone as everywhere else.

## 2. Instagram

1. In the Instagram app: Settings → Account type and tools → **Switch to
   professional account → Business**.
2. Link it to the new Facebook Page (Page settings → Linked accounts →
   Instagram).
3. While you're there, change the display name from "Everyday Digital" to
   **"Every Day Digital"** so it matches everything else.

## 3. Meta app and tokens

1. https://developers.facebook.com → My Apps → Create app → type **Business**.
2. Add the products **Facebook Login for Business** and **Instagram Graph API**.
3. Generate a **long-lived Page access token** with these permissions:
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`,
   `instagram_basic`, `instagram_content_publish`, `business_management`.
   (Graph API Explorer → get User token → exchange for long-lived → `GET /me/accounts`
   gives the Page token, which doesn't expire while the user token is valid.)
4. Note the **Page ID** (Page → About → Page transparency, or `/me/accounts`).
5. Get the **Instagram user ID**: `GET /{page-id}?fields=instagram_business_account`.
6. Your app can stay in development mode when only your own accounts are used.

Same pattern as the Home Office Space poster, so you can copy settings from there.

## 4. LinkedIn

1. https://www.linkedin.com/developers → Create app, associated with the
   **Every Day Digital** company page (you must be a page admin). Verify the app
   from the company page.
2. Products → request **Community Management API** (Development tier is enough
   for a handful of posts a week; it has daily call limits).
3. Auth → OAuth 2.0 scopes: `w_organization_social`, `r_organization_social`.
4. Generate an access token (the app's token generator). Tokens last 60 days —
   set a calendar reminder to regenerate, or ask for refresh-token access later.
5. Organization ID: the number in your company page admin URL
   (linkedin.com/company/<number>/admin).
6. `LINKEDIN_VERSION` is a YYYYMM date. LinkedIn supports each version for about a
   year; if posts fail with a version error, set it to a recent month.

## 5. Install and switch on

1. Vercel → Settings → Environment Variables (Production): add everything in the
   "Social posting" block of `.env.example`. Leave `SOCIAL_LIVE` unset for now.
   Redeploy.
2. Upload `wpTheme/mu-plugins/edd-social.php` **and** `edd-common.php` (the
   shared helpers it loads) to `wp-content/mu-plugins/` on Cloudways. Without
   `edd-common.php` WordPress stops with a fatal error.
3. Add to `wp-config.php`:

   ```php
   define( 'EDD_SOCIAL_URL',    'https://everydaydigital.co.nz/api/social' );
   define( 'EDD_SOCIAL_SECRET', 'same value as SOCIAL_WEBHOOK_SECRET' );
   define( 'EDD_SITE_URL',      'https://everydaydigital.co.nz' );
   ```

4. Make sure WP-Cron runs. Cloudways: either leave WordPress's built-in cron on,
   or add a server cron job every 5 minutes:
   `wget -q -O - https://cms.everydaydigital.co.nz/wp-cron.php?doing_wp_cron >/dev/null 2>&1`
5. Publish a test post (or use **Share again now** on an existing one). After a
   minute, refresh the editor: the box shows the captions and "Test mode".
6. Happy with the captions? Set `SOCIAL_LIVE=1` in Vercel and redeploy.

## Other posts that aren't new content

The weekly blog idea routine is separate. For recurring posts (a service
spotlight, a testimonial, "get in touch"), the simplest route is a scheduled
task that calls `/api/social` with a hand-built payload: the same JSON as the
plugin sends, with the `Authorization: Bearer <SOCIAL_WEBHOOK_SECRET>` header.
It must include `type` (`"post"` or `"project"`), `title` and an absolute
`url`, or the route returns 400. Or use a scheduler like Buffer or Meta Business
Suite for those, and let this pipeline handle new content only.

## Troubleshooting

- WordPress box says "EDD_SOCIAL_URL / EDD_SOCIAL_SECRET not set": wp-config constants missing.
- `SOCIAL_WEBHOOK_SECRET is not configured` (HTTP 500): the secret isn't set in Vercel, so the route refuses every request.
- `Unauthorized` (HTTP 401): the two secrets don't match.
- `The site returned HTTP …`: the route didn't answer with its own JSON (a timeout or an error page from Vercel). Check the function logs.
- `type must be "post" or "project"` (HTTP 400): a hand-built payload is missing `type`.
- Facebook `(#200) ... permission`: the token is a user token, not a Page token, or lacks `pages_manage_posts`.
- Instagram "needs a JPEG featured image": set a .jpg featured image.
- Instagram "still processing the image after 20s": Instagram was slow to fetch the image. Use **Share again now** in a few minutes.
- Each call to Facebook, Instagram or LinkedIn is abandoned after 15 seconds, so one slow channel can't use up the route's 60-second limit.
- LinkedIn `HTTP 401`: token expired (60 days). Regenerate it.
- Nothing happens at all: WP-Cron isn't running (see step 5.4).
