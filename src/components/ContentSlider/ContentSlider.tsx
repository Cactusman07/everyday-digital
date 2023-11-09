import React from 'react';

const ContentSlider = ({
	contentData,
	show,
	toggle,
	updateContentData,
}: any) => {
	const closeAndClear = () => {
		toggle();
		setTimeout(() => {
			updateContentData({
				title: '',
				content: '',
				image: '',
				date: '',
				isIcon: false,
				isProfile: false,
			});
		}, 500);
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
							!!contentData.isIcon ? 'h-40 w-auto m-auto p-8' : ''
						} ${
							!!contentData.isProfile
								? 'h-60 w-auto mx-auto my-8 rounded-full shadow-md shadow-[#4bafeb] border border-black'
								: 'w-full mt-[-20%]'
						}`}
						src={image?.sourceUrl}
						alt={image?.altText}
					/>
				</div>
			)}
			<div className='pr-8 pt-8 pl-8 relative'>
				<div
					className='absolute top-0 right-0 pl-4 pt-8 pr-8'
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
					className='text-black'
					dangerouslySetInnerHTML={{ __html: contentData.content }}
				/>
			</div>

			<style>{`
		#contentSlider{
			transition: all 500ms ease;
		}
		.hideContentSlider {
			width:0px;
			left:-300px;
			opacity: 0;
		}
		.showContentSlider {
			width: 100%;
			height: 100vh;
			left:0;
			opacity:1;
		}
		@media only screen and (min-width: 600px) {
			.showContentSlider{
				width: 50%;
				min-width:50vh;
				transition: all 500ms ease;
			}
		}
	`}</style>
		</div>
	);
};

export default ContentSlider;
