import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServices, getTestimonials } from "@/lib/wordpress";
import SingleItemContent from "@/components/SingleItemContent";
import { ServiceJsonLd } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const services = await getServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const services = await getServices();
    const service = services.find((s) => s.slug === slug);
    if (!service) return {};
    const description = service.excerpt
      ? service.excerpt.replace(/<[^>]*>/g, "").slice(0, 160)
      : undefined;
    return {
      title: service.title,
      description,
      openGraph: {
        title: service.title,
        description,
        images: service.featuredImage
          ? [{ url: service.featuredImage.node.sourceUrl }]
          : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;

  let services, testimonials;
  try {
    [services, testimonials] = await Promise.all([
      getServices(),
      getTestimonials(),
    ]);
  } catch {
    notFound();
  }

  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://everydaydigital.co.nz";

  return (
    <div className="inner-page">
      {/* ServiceJsonLd tells search engines this page describes a service offering */}
      <ServiceJsonLd
        name={service.title}
        description={service.excerpt?.replace(/<[^>]*>/g, "").slice(0, 160)}
        url={`${SITE_URL}/services/${service.slug}`}
      />
      <SingleItemContent
        type="service"
        item={service}
        testimonials={testimonials}
      />
    </div>
  );
}
