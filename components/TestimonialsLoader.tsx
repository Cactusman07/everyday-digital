"use client";

// next/dynamic with ssr:false is only allowed from a Client Component, so this
// thin wrapper exists purely to let the (server) PageContent/SingleItemContent
// components lazy-load Testimonials without ever evaluating Swiper on the server.
import dynamic from "next/dynamic";

const Testimonials = dynamic(() => import("./Testimonials"), { ssr: false });

export default Testimonials;
