import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { WPTestimonial } from '../../types';

const Testimonials = ({ data }: { data: WPTestimonial[] }) => {
	return (
		<>
			{data?.length > 0 && (
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
						modules={[Autoplay, Pagination, Navigation]}
						className='mySwiper max-h-48 !h-48'>
						{data.map((testimonial: WPTestimonial, index: number) => (
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
