import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Testimonials = (testimonials: any) => {
	return (
		<>
			{testimonials?.data?.length > 0 && (
				<div id='testimonials' className='mt-8 text-center'>
					<h2>See what others think about us!</h2>
					<Swiper
						autoplay={{
							delay: 3000,
						}}
						slidesPerView={2}
						spaceBetween={20}
						loop={true}
						pagination={{
							clickable: true,
						}}
						navigation={true}
						modules={[Pagination, Navigation]}
						className='mySwiper max-h-48 !h-48'>
						{testimonials.data.map((testimonial: any, index: number) => (
							<SwiperSlide key={`${index}-testimonial`}>
								<div className='testimonial text-left italic text-sm'>
									<h4>{testimonial.title}</h4>
									<div
										className='testimonial-content'
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
};

export default Testimonials;
