import React from 'react';
import Masonry from 'react-masonry-css';

import { breakpointColumnsObj } from '../../content';

const GeneralContentRenderer = ({
	data,
	icons,
	toggle,
	updateContentData,
}: {
	data: any;
	icons: boolean;
	toggle: () => {};
	updateContentData: (data: any) => {};
}) => {
	const updateContentAndToggle = (
		title: any,
		content: any,
		image: any,
		date: any,
		isIcon: boolean
	) => {
		updateContentData({
			title: title,
			content: content,
			image: image,
			date: date,
			isIcon: isIcon,
		});
		toggle();
	};

	return (
		<>
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className='my-masonry-grid mt-8'
				columnClassName='my-masonry-grid_column'>
				{data.map((item: any, index: number) => {
					const date = item?.date
						? new Date(item.date).toLocaleDateString()
						: null;

					return (
						<div
							key={`${index}-item`}
							onClick={(e: React.MouseEvent<HTMLDivElement>) => {
								e.preventDefault();
								updateContentAndToggle(
									item.title,
									item.content,
									item.featuredImage,
									date,
									icons
								);
							}}
							className='bg-gradient-to-r from-10% from-[#4b6ceb] to-[#ffffff] to-50% hover:from-5% rounded-lg cursor-pointer text-black flex flex-col m-5'>
							{icons && !!item.featuredImage?.node?.sourceUrl && (
								<div className='mx-auto mt-6 max-w-[85px]'>
									<img
										src={item.featuredImage?.node?.sourceUrl}
										alt={item.featuredImage?.node?.altText}
									/>
								</div>
							)}
							{!icons && !!item.featuredImage?.node?.sourceUrl && (
								<div
									className={`project overflow-hidden h-48 w-full flex items-center justify-center`}>
									<img
										src={item.featuredImage?.node?.sourceUrl}
										alt={item.featuredImage?.node?.altText}
										className={`w-full transition duration-300 grayscale hover:grayscale-0 object-cover scale-110 hover:scale-100`}
									/>
								</div>
							)}
							<div className='p-6'>
								{!!date && (
									<span className='text-xs italic font-bold'>{date}</span>
								)}
								<h4 className='mt-0'>{item.title}</h4>
								<div
									className='services-content'
									dangerouslySetInnerHTML={{
										__html: `${icons ? item.excerpt : item.content}`,
									}}></div>
							</div>
						</div>
					);
				})}
			</Masonry>
		</>
	);
};

export default GeneralContentRenderer;
