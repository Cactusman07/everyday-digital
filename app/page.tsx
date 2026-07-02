// Home page ("/") — renders nothing because the home content (hero, CTAs, animations)
// lives in the root layout.tsx which wraps all pages. This file must exist so Next.js
// knows "/" is a valid route (without it, you'd get a 404 at the root URL).
export default function HomePage() {
  return null;
}
