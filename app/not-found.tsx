import Link from "next/link";

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
