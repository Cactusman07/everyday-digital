// WordPress HTML as a readable article: headings get ids, and an "On this
// page" contents list sits beside the text once it has enough headings. A
// reading-progress bar runs along the top of the window for long reads.

import ReadingProgress from "@/components/showcase/ReadingProgress";
import TableOfContents from "@/components/showcase/TableOfContents";
import { withHeadingIds } from "@/lib/html";

/** Articles with at least this many h2/h3 headings get a contents list. */
const MIN_HEADINGS_FOR_CONTENTS = 3;

export default function ArticleBody({
  html,
  as: Tag = "div",
  alwaysShowProgress = false,
}: {
  /** Sanitised WordPress HTML. */
  html: string;
  /** "article" for a self-contained post, project or service. */
  as?: "div" | "article";
  /** Show the progress bar even when the text is too short for contents. */
  alwaysShowProgress?: boolean;
}) {
  const { html: withIds, toc } = withHeadingIds(html);
  const hasContents = toc.length >= MIN_HEADINGS_FOR_CONTENTS;
  return (
    <>
      {(alwaysShowProgress || hasContents) && <ReadingProgress />}
      <div className={`show__body${hasContents ? "" : " show__body--solo"}`}>
        {hasContents && <TableOfContents items={toc} />}
        {/* data-article: what ReadingProgress measures against */}
        <Tag
          className="prose-edd show__article"
          data-article
          dangerouslySetInnerHTML={{ __html: withIds }}
        />
      </div>
    </>
  );
}
