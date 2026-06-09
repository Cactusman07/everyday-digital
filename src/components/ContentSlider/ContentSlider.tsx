import React from 'react';
import { Link } from 'react-router-dom';

interface ContentSliderData {
	title: string;
	content: string;
	image?: { node?: { sourceUrl?: string; altText?: string }; sourceUrl?: string; altText?: string } | null;
	date?: string | null;
	isIcon?: boolean;
	isProfile?: boolean;
}

interface ContentSliderProps {
	contentData: ContentSliderData;
	show: boolean;
	toggle: () => void;
	updateContentData: (data: ContentSliderData) => void;
}

const ContentSlider = ({ contentData, show, toggle, updateContentData }: ContentSliderProps) => {
	const closeAndClear = () => {
		toggle();
		setTimeout(() => {
			updateContentData({
				title: '',
				content: '',
				image: null,
				date: '',
				isIcon: false,
				isProfile: false,
			});
		}, 100);
	};

	const image = !!contentData?.image?.node?.sourceUrl
		? contentData?.image?.node
		: !!contentData?.image?.sourceUrl
		? contentData?.image
		: null;

	return (
		<div
			id='contentSlider'
			className={`${
				show ? 'showContentSlider' : 'hideContentSlider'
			} fixed top-0 left-0 z-50 bg-white bottom-0`}>
			{!!image?.sourceUrl && (
				<div className='w-full m-0 max-h-80 lg:max-h-96 overflow-hidden'>
					<img
						className={`${
							!!contentData.isIcon
								? 'h-40 w-auto m-auto p-8'
								: !!contentData.isProfile
								? 'h-60 w-auto mx-auto my-8 rounded-full border border-black'
								: 'w-full mt-[-20%]'
						}`}
						src={image?.sourceUrl}
						alt={image?.altText}
					/>
				</div>
			)}
			<div
				className='pr-8 pt-8 pl-8 relative overflow-x-hidden overflow-y-scroll'
				style={{ height: 'calc(100% - 20rem)' }}>
				<div
					className='absolute top-0 right-0 pl-4 pt-8 pr-8 '
					onClick={closeAndClear}>
					<svg
						className='h-8 w-8 text-black cursor-pointer animate-pulse'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<line x1='18' y1='6' x2='6' y2='18' />
						<line x1='6' y1='6' x2='18' y2='18' />
					</svg>
				</div>
				<span className='text-black text-xs italic font-bold'>
					{contentData.date}
				</span>
				<h2 className='text-black'>{contentData.title}</h2>
				<div
					className='text-black h-min pb-24'
					dangerouslySetInnerHTML={{ __html: contentData.content }}
				/>
			</div>

			{contentData.isIcon && (
				<Link to='/contact/' onClick={closeAndClear}>
					<div className='absolute bottom-0 left-0 right-0 px-8 py-5 bg-gradient-to-r from-[#4b6ceb] to-[#4bafeb] flex items-center justify-between group cursor-pointer'>
						<div>
							<p className='text-white font-semibold uppercase tracking-widest text-sm m-0'>Interested in this service?</p>
							<p className='text-white/70 text-xs m-0 mt-1'>Get in touch and let's talk.</p>
						</div>
						<svg
							className='h-6 w-6 text-white transition-transform duration-300 group-hover:translate-x-1'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<line x1='5' y1='12' x2='19' y2='12' />
							<polyline points='12 5 19 12 12 19' />
						</svg>
					</div>
				</Link>
			)}

		</div>
	);
};

export default ContentSlider;
