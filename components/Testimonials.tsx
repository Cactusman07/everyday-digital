// "use client" — Swiper requires browser APIs (touch events, DOM measurement)
"use client";

// next/dynamic — Next.js version of React.lazy(). The { ssr: false } option means these
// components are only loaded in the browser, never rendered on the server. This is needed
// because Swiper accesses window/document on import, which would crash during SSR.
import dynamic from "next/dynamic";
import type { WPTestimonial } from "@/lib/types";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
});
const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false },
);

import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function Testimonials({ data }: { data: WPTestimonial[] }) {
  // Swiper's loop mode requires more slides than are shown at once; with only
  // one or two testimonials, forcing slidesPerView={2}/loop breaks and the
  // carousel renders blank. Fall back to a single, static slide instead.
  const slidesPerView = Math.min(data?.length ?? 1, 2);
  const canLoop = (data?.length ?? 0) > slidesPerView;

  return (
    <>
      {data?.length > 0 && (
        <div id="testimonials" className="mt-8 text-center">
          <h2>See what others think about us!</h2>
          <Swiper
            autoplay={data.length > 1 ? { delay: 3000 } : false}
            slidesPerView={slidesPerView}
            spaceBetween={20}
            loop={canLoop}
            pagination={data.length > 1 ? { clickable: true } : false}
            navigation={data.length > 1}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper max-h-48 !h-48"
          >
            {data.map((testimonial: WPTestimonial, index: number) => (
              <SwiperSlide key={`${index}-testimonial`}>
                <div className="testimonial text-left italic text-sm">
                  <h4>{testimonial.title}</h4>
                  <div
                    className="testimonial-content"
                    dangerouslySetInnerHTML={{ __html: testimonial.content }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>
  );
}
