import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPosts, getTestimonials } from "@/lib/wordpress";
import SingleItemContent from "@/components/SingleItemContent";
import { ArticleJsonLd } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render all blog post pages at build time by returning their slugs
export async function generateStaticParams() {
  try {
    const posts = await getPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// Per-post SEO metadata — sets title, description, and Open Graph image from WordPress data.
// The description strips HTML tags from the excerpt and truncates to 160 chars (Google's limit).
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const posts = await getPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) return {};
    const description = post.excerpt
      ? post.excerpt.replace(/<[^>]*>/g, "").slice(0, 160)
      : undefined;
    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        images: post.featuredImage
          ? [{ url: post.featuredImage.node.sourceUrl }]
          : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  let posts, testimonials;
  try {
    [posts, testimonials] = await Promise.all([
      getPosts(),
      getTestimonials(),
    ]);
  } catch {
    notFound();
  }

  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://everydaydigital.co.nz";

  return (
    <div className="inner-page">
      {/* ArticleJsonLd outputs structured data so Google can show rich results
          (author, date, image) in search listings for this blog post */}
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt?.replace(/<[^>]*>/g, "").slice(0, 160)}
        datePublished={post.date}
        image={post.featuredImage?.node?.sourceUrl}
        url={`${SITE_URL}/blog/${post.slug}`}
      />
      <SingleItemContent type="blog" item={post} testimonials={testimonials} />
    </div>
  );
}
