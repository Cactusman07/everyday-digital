// The Services page grid. Every card is a real link to the service's own
// page (search engines follow links, not click handlers).

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import ServiceIcon, { hasServiceIcon } from "@/components/shared/ServiceIcon";
import { DEFAULT_ACCENT } from "@/lib/brand";
import { excerptOf } from "@/lib/html";
import { getServiceMeta, sortByServiceOrder } from "@/lib/services";
import type { WPService } from "@/lib/wordpress";
import { itemPath } from "@/lib/wordpress/content-types";
import { isCmsMediaUrl } from "@/lib/wordpress/images";

export default function ServiceGrid({ services }: { services: WPService[] }) {
  return (
    <ul className="svc-grid">
      {sortByServiceOrder(services).map((item, i) => {
        const meta = getServiceMeta(item.slug);
        const image = item.featuredImage?.node.sourceUrl;
        return (
          <li key={item.databaseId}>
            <Link
              href={itemPath("service", item.slug)}
              className="edd-card svc-grid__card has-sicon"
              style={{ "--k": meta?.colour ?? DEFAULT_ACCENT } as CSSProperties}
            >
              <span className="svc-grid__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Our own icon when there is one, else the WordPress image */}
              {hasServiceIcon(item.slug) ? (
                <ServiceIcon slug={item.slug} size={48} />
              ) : (
                isCmsMediaUrl(image) && (
                  <Image
                    src={image}
                    alt=""
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain content-icon-tint"
                  />
                )
              )}
              <h2 className="edd-card__title">{item.title}</h2>
              {meta && (
                <span className="svc-grid__word">Every Day {meta.word}</span>
              )}
              <span className="svc-grid__text">{excerptOf(item, 170)}</span>
              <span className="svc-grid__go">Find out more →</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
