import { ServiceJsonLd } from "@/components/seo/JsonLd";
import ItemShowcase from "@/components/showcase/ItemShowcase";
import { serviceRoute, type SlugParams } from "@/lib/detail-routes";

export const generateStaticParams = serviceRoute.generateStaticParams;
export const generateMetadata = serviceRoute.generateMetadata;

export default async function ServicePage(props: SlugParams) {
  const {
    item: service,
    items,
    testimonials,
    meta,
    url,
  } = await serviceRoute.load(props);
  return (
    <>
      <ServiceJsonLd
        slug={service.slug}
        name={service.title}
        description={meta.description}
        url={url}
        image={meta.image}
      />
      <ItemShowcase
        showcase={{ type: "service", item: service, siblings: items }}
        testimonials={testimonials}
      />
    </>
  );
}
