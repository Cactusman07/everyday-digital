import React, { useState, useCallback } from 'react';
import DetailPanel from '../DetailPanel/DetailPanel';
import { WPService, WPPost } from '../../types';

type ContentItem = WPService | WPPost;

const GeneralContentRenderer = ({
	data,
	icons,
	toggle,
	updateContentData,
}: {
	data: ContentItem[];
	icons: boolean;
	toggle: () => void;
	updateContentData: (data: any) => void;
}) => {
	const [active, setActive] = useState<ContentItem | null>(null);
	const close = useCallback(() => setActive(null), []);

	if (icons) {
		return (
			<>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-8'>
					{data.map((item: ContentItem, index: number) => (
						<div
							key={`${index}-item`}
							onClick={() => setActive(item)}
							className='bg-[#1a1a1a] border border-white/8 rounded-xl p-5 cursor-pointer hover:border-[#4b6ceb]/50 hover:bg-[#212121] transition-all duration-300 group flex flex-col gap-3'>
							{!!item.featuredImage?.node?.sourceUrl && (
								<div className='text-[#4bafeb] mb-1'>
									<img
										src={item.featuredImage.node.sourceUrl}
										alt={item.featuredImage.node.altText}
										className='w-5 h-5 object-contain'
										style={{ filter: 'invert(62%) sepia(57%) saturate(553%) hue-rotate(168deg) brightness(103%) contrast(97%)' }}
									/>
								</div>
							)}
							<p className='text-white text-base font-medium m-0'>{item.title}</p>
							<div
								className='text-white/60 text-sm leading-relaxed services-content'
								dangerouslySetInnerHTML={{ __html: item.excerpt }}
							/>
							<span className='text-[#4bafeb] text-xs uppercase tracking-widest mt-1 flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200'>
								Find out more
								<svg
									className='h-3 w-3'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<line x1='5' y1='12' x2='19' y2='12' />
									<polyline points='12 5 19 12 12 19' />
								</svg>
							</span>
						</div>
					))}
				</div>

				{active && (
					<DetailPanel
						title={active.title}
						content={active.content ?? ''}
						image={active.featuredImage?.node ?? null}
						type='service'
						onClose={close}
					/>
				)}
			</>
		);
	}

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8'>
			{data.map((item: ContentItem, index: number) => {
				const date = (item as WPPost)?.date
					? new Date((item as WPPost).date).toLocaleDateString()
					: null;

				return (
					<div
						key={`${index}-item`}
						onClick={(e: React.MouseEvent<HTMLDivElement>) => {
							e.preventDefault();
							updateContentData({
								title: item.title,
								content: item.content,
								image: item.featuredImage,
								date: date,
								isIcon: false,
							});
							toggle();
						}}
						className='bg-[#1a1a1a] border border-white/8 rounded-xl cursor-pointer hover:border-[#4b6ceb]/50 hover:bg-[#212121] transition-all duration-300 group flex flex-col overflow-hidden'>
						{!!item.featuredImage?.node?.sourceUrl && (
							<div className='w-full h-44 overflow-hidden flex-shrink-0'>
								<img
									src={item.featuredImage.node.sourceUrl}
									alt={item.featuredImage.node.altText}
									className='w-full h-full object-cover transition duration-300 group-hover:scale-105'
								/>
							</div>
						)}
						<div className='p-5 flex flex-col gap-2 flex-1'>
							{!!date && (
								<span className='text-white/40 text-xs'>{date}</span>
							)}
							<p className='text-white text-base font-medium m-0'>{item.title}</p>
							<div
								className='text-white/60 text-sm leading-relaxed services-content'
								dangerouslySetInnerHTML={{ __html: item.excerpt || item.content }}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default GeneralContentRenderer;
