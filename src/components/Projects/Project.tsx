import React, { useState } from 'react';

interface Project {
	title: string;
	image: {
		altText: string;
		sourceUrl: string;
	} | null;
	excerpt: string;
	content: string;
	index: number;
	carousel: boolean;
}

const Project = (props: Project) => {
	const [showMoreInfo, setShowMoreInfo] = useState(false);
	const showImage = !!props.image;
	const isCarousel = !!props.carousel;

	const toggleShowMoreInfo = () => {
		setShowMoreInfo(!showMoreInfo);
	};

	return (
		<>
			{showImage ? (
				<div
					className={`project overflow-hidden ${
						isCarousel ? 'h-72 w-80' : 'h-48 w-full'
					} flex items-center justify-center`}>
					<img
						src={props.image?.sourceUrl}
						alt={props.image?.altText}
						className={`w-full transition duration-300 grayscale hover:grayscale-0 ${
							isCarousel ? 'cursor-grab' : 'cursor-pointer'
						} object-cover scale-110 hover:scale-100`}
						onClick={toggleShowMoreInfo}
					/>
				</div>
			) : (
				<div className='px-6 py-2'>
					<h4 className='mb-2 text-black'>{props.title}</h4>
				</div>
			)}

			{showMoreInfo && (
				<div className='fixed top-8 overflow-hidden bottom-8 left-8 right-8 shadow-md bg-white rounded-lg z-50'>
					{showImage && (
						<div
							style={{
								backgroundImage: `url(${props.image?.sourceUrl})`,
								backgroundRepeat: 'no-repeat',
								backgroundSize: '100%',
								width: '100%',
								height: '200px',
							}}
						/>
					)}
					<h4 className='mb-2 text-black'>{props.title}</h4>
					<p
						className='text-gray-700 text-base'
						dangerouslySetInnerHTML={{ __html: props.excerpt }}></p>
				</div>
			)}
		</>
	);
};

export default Project;
