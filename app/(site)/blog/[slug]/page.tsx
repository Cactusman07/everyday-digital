import { ArticleJsonLd } from "@/components/seo/JsonLd";
import ItemShowcase from "@/components/showcase/ItemShowcase";
import { postRoute, type SlugParams } from "@/lib/detail-routes";
import { wordCount } from "@/lib/html";

export const generateStaticParams = postRoute.generateStaticParams;
export const generateMetadata = postRoute.generateMetadata;

export default async function BlogPostPage(props: SlugParams) {
  const {
    item: post,
    items,
    testimonials,
    meta,
    url,
  } = await postRoute.load(props);
  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={meta.description}
        datePublished={meta.article?.publishedTime}
        dateModified={meta.article?.modifiedTime}
        keywords={meta.article?.tags}
        image={meta.image}
        url={url}
        wordCount={wordCount(post.content)}
      />
      <ItemShowcase
        showcase={{ type: "post", item: post, siblings: items }}
        testimonials={testimonials}
      />
    </>
  );
}
