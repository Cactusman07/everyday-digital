// 404 for URLs no route matches (e.g. /a/b/c). Single-segment URLs reach
// app/(site)/[slug], whose notFound() renders app/(site)/not-found.tsx inside
// the site layout; this gives deeper URLs the same page.

import SiteLayout from "./(site)/layout";
import PageNotFound from "./(site)/not-found";

export default function NotFound() {
  return (
    <SiteLayout>
      <PageNotFound />
    </SiteLayout>
  );
}
