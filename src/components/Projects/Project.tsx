import React, { useState } from 'react';

interface Project {
	toggle: () => {};
	updateContentData: (data: any) => {};
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
	const showImage = !!props.image;
	const isCarousel = !!props.carousel;

	const updateContentAndToggle = (
		title: any,
		content: any,
		image: any,
		date: any,
		isIcon: boolean,
		isProfile: boolean
	) => {
		props.updateContentData({
			title: title,
			content: content,
			image: image,
			date: date,
			isIcon: isIcon,
			isProfile: isProfile,
		});
		props.toggle();
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
						onClick={(e: React.MouseEvent<HTMLDivElement>) => {
							e.preventDefault();
							updateContentAndToggle(
								props.title,
								props.content,
								props.image,
								null,
								false,
								false
							);
						}}
					/>
				</div>
			) : (
				<div className='px-6 py-2'>
					<h4 className='mb-2 text-black'>{props.title}</h4>
				</div>
			)}
		</>
	);
};

export default Project;
