import React, { useState } from 'react';
import './AboutUsStyles';

const AboutUsProfiles = ({ data }: { data: any }) => {
	const [showMoreInfo, setShowMoreInfo] = useState(false);

	const toggleShowMoreInfo = () => {
		setShowMoreInfo(!showMoreInfo);
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
							onClick={toggleShowMoreInfo}>
							<div className='image-wrapper'>
								<img
									src={profile.featuredImage?.node?.sourceUrl}
									alt={profile.featuredImage?.node?.altText}
								/>
							</div>
							<p className='title' data-cta={`${profile.excerpt}`}>
								{profile.title}
							</p>
							{showMoreInfo && (
								<div className='fixed top-8 overflow-hidden bottom-8 left-8 right-8 shadow-md bg-white rounded-lg z-50 lg:bottom-28 lg:top-28 lg:left-28 lg:right-28'>
									<p
										style={{
											fontSize: '150%',
											textAlign: 'right',
											fontWeight: '600',
											cursor: 'pointer',
											color: 'black',
											margin: '30px 30px 0 0',
										}}
										onClick={toggleShowMoreInfo}>
										X
									</p>
									<div
										style={{
											backgroundImage: `url(${profile.featuredImage?.node?.sourceUrl})`,
											backgroundRepeat: 'no-repeat',
											backgroundSize: '100%',
											width: '200px',
											height: '200px',
											borderRadius: '50%',
											margin: '30px auto',
											boxShadow: 'black 5px 5px 14px',
										}}
									/>
									<h4 className='text-black px-4 my-2 text-center'>
										{profile.title}
									</h4>
									<div
										className='text-gray-700 text-base p-4'
										dangerouslySetInnerHTML={{ __html: profile.content }}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</>
	);
};

export default AboutUsProfiles;
