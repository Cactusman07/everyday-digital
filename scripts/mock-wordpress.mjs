// A stand-in for WPGraphQL, used by the Playwright e2e tests so they test the
// site rather than whether the live CMS is reachable (it sits behind bot
// protection that blocks CI runners). Answers the paginated list queries in
// lib/wordpress/queries.ts with the nodes in e2e/fixtures/wordpress.json.
//
//   node scripts/mock-wordpress.mjs [port]     (default 4010)

import { readFileSync } from "node:fs";
import { createServer } from "node:http";

const port = Number(process.argv[2] ?? 4010);
const fixtures = JSON.parse(
  readFileSync(new URL("../e2e/fixtures/wordpress.json", import.meta.url)),
);

createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    // Every query reads one connection, e.g. `posts(first: 100, ...)`
    const { query = "" } = body ? JSON.parse(body) : {};
    const connection = /\{\s*(\w+)\(/.exec(query)?.[1];
    const data = connection
      ? {
          [connection]: {
            pageInfo: { hasNextPage: false, endCursor: null },
            nodes: fixtures[connection] ?? [],
          },
        }
      : {};
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ data }));
  });
}).listen(port, () =>
  console.log(`mock WordPress on http://localhost:${port}/graphql`),
);
