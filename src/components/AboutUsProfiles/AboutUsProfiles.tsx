import React from 'react';
import './AboutUsStyles';

const AboutUsProfiles = ({ data, toggle, updateContentData }: any) => {
	const updateContentAndToggle = (
		title: any,
		content: any,
		image: any,
		date: any,
		isIcon: boolean,
		isProfile: boolean
	) => {
		updateContentData({
			title: title,
			content: content,
			image: image,
			date: date,
			isIcon: isIcon,
			isProfile: isProfile,
		});
		toggle();
	};

	const stripHtml = (html) => {
		let tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	};

	return (
		<>
			<h2 className='text-center'>Meet the Team</h2>
			<div className='flex about-container'>
				{data.map((profile: any, index: number) => {
					return (
						<div
							key={`${index}-about`}
							className='promo m-5'
							onClick={(e: React.MouseEvent<HTMLDivElement>) => {
								e.preventDefault();
								updateContentAndToggle(
									profile.title,
									profile.content,
									profile.featuredImage,
									null,
									false,
									true
								);
							}}>
							<div className='image-wrapper'>
								<img
									src={profile.featuredImage?.node?.sourceUrl}
									alt={profile.featuredImage?.node?.altText}
								/>
							</div>
							<p className='title' data-cta={`${stripHtml(profile.excerpt)}`}>
								{profile.title}
							</p>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default AboutUsProfiles;
