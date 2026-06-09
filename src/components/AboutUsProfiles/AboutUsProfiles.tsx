import React from 'react';
import './AboutUsStyles.css';
import { WPTeam } from '../../types';

interface AboutUsProfilesProps {
	data: WPTeam[];
	toggle: () => void;
	updateContentData: (data: any) => void;
}

const AboutUsProfiles = ({ data, toggle, updateContentData }: AboutUsProfilesProps) => {
	const updateContentAndToggle = (
		title: string,
		content: string,
		image: WPTeam['featuredImage'],
		date: string | null,
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

	const stripHtml = (html: string) => {
		let tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	};
	//{testimonials?.data?.length > 0
	return (
		data.length > 0 && (
			<>
				<h2 className='text-center'>Meet the Team</h2>
				<div className='flex about-container'>
					{data.map((profile: WPTeam, index: number) => {
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
		)
	);
};

export default AboutUsProfiles;
