import type { WPTestimonial } from "@/lib/types";

export default function Testimonials({ data }: { data: WPTestimonial[] }) {
  return (
    <>
      {data?.length > 0 && (
        <div id="testimonials" className="mt-8">
          <h2 className="text-center">See what others think about us!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
            {data.map((testimonial: WPTestimonial, index: number) => (
              <div
                key={`${testimonial.title}-${index}`}
                className="bg-[#1a1a1a] border border-white/8 rounded-xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="h-9 w-9 flex-shrink-0 text-[#4bafeb]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                  </svg>
                  <h4 className="text-white text-base font-semibold m-0">
                    {testimonial.title}
                  </h4>
                </div>
                <div
                  className="testimonial-content text-white/60 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: testimonial.content }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
