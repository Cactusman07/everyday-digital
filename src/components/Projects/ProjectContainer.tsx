import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Masonry from 'react-masonry-css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import { EffectCube, Pagination, Autoplay } from 'swiper/modules';

import { Project } from '../ContentIndex';
import { breakpointColumnsObj } from '../../content';

const ProjectContainer = ({ data, toggle, updateContentData }: any) => {
	const [isCarousel, setIsCarousel] = useState(false);
	const projectFound = data.length > 0 ? true : false;

	const toggleCarousel = () => {
		setIsCarousel(!isCarousel);
	};

	return (
		<div id='projects' className='mt-4'>
			{!projectFound ? (
				<p>
					Your project could be here... <Link to='/contact'>Get in touch!</Link>
				</p>
			) : (
				<>
					<p>
						Your project could be here...{' '}
						<Link to='/contact'>Get in touch!</Link>
					</p>
					<div className='my-6 mx-auto h-8 w-32'>
						<label className='relative flex items-center cursor-pointer'>
							<input
								type='checkbox'
								className='sr-only peer'
								checked={isCarousel}
								onChange={toggleCarousel}
							/>
							<div className="mr-4 w-16 min-w-[64px] h-8 bg-white rounded-full peer  dark:bg-gray-700 peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-black after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 "></div>
							<span className='text-lg font-medium dark:text-gray-300'>
								{isCarousel ? 'Carousel' : 'Grid'}
							</span>
						</label>
					</div>

					{!!isCarousel ? (
						<Swiper
							effect={'cube'}
							grabCursor={true}
							cubeEffect={{
								shadow: true,
								slideShadows: true,
								shadowOffset: 20,
								shadowScale: 0.94,
							}}
							autoplay={{
								delay: 3000,
							}}
							loop={true}
							pagination={true}
							modules={[Autoplay, EffectCube, Pagination]}
							className='mySwiper'>
							{data.map((project: any, index: number) => (
								<SwiperSlide key={`${index}-swiper`}>
									<Project
										title={project.title}
										image={
											!!project.featuredImage
												? project.featuredImage.node
												: null
										}
										excerpt={project.excerpt}
										content={project.content}
										key={index}
										index={index}
										carousel={true}
										toggle={toggle}
										updateContentData={updateContentData}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					) : (
						<Masonry
							breakpointCols={breakpointColumnsObj}
							className='my-masonry-grid mt-8'
							columnClassName='my-masonry-grid_column'>
							{data.map((project: any, index: number) => (
								<Project
									title={project.title}
									image={
										!!project.featuredImage ? project.featuredImage.node : null
									}
									excerpt={project.excerpt}
									content={project.content}
									key={index}
									index={index}
									carousel={false}
									toggle={toggle}
									updateContentData={updateContentData}
								/>
							))}
						</Masonry>
					)}
				</>
			)}
		</div>
	);
};

export default ProjectContainer;
