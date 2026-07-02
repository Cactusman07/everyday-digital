import Link from "next/link";

// Next.js not-found.tsx — rendered when notFound() is called from any page, or when
// a user visits a URL that doesn't match any route. Next.js automatically returns
// a 404 HTTP status code. Uses next/link for client-side navigation (no full page reload).
export default function NotFound() {
  return (
    <div className="inner-page">
      <div id="content" className="mt-48 mb-24 mx-8 relative z-0">
        <h2>Oops! That link doesn&apos;t seem to work!</h2>
        <div className="mt-5">
          <p>
            No need to worry. Here are some helpful links to get you back on
            track:
          </p>
          <ul className="mt-4 ml-2 text-lg">
            <li className="mt-2">
              <p>
                <Link href="/">Home</Link>
              </p>
            </li>
            <li className="mt-2">
              <p>
                <Link href="/blog">Blog</Link>
              </p>
            </li>
            <li className="mt-2">
              <p>
                <Link href="/contact">Contact</Link>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
