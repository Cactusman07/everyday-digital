import React from 'react';

const fbIcon = require('../../assets/facebook-4-64.png').default;
const igIcon = require('../../assets/instagram-4-64.png').default;
const liIcon = require('../../assets/linkedin-4-64.png').default;

interface SocialIcons {
	absolutePos?: boolean;
}

const SocialIcons = (props: SocialIcons) => {
	return (
		<div
			id='social'
			className={`flex md:block ${
				!!props.absolutePos ? 'absolute' : 'relative'
			} bottom-0 left-0 md:left-5`}>
			<a
				className='md:mb-3 mr-3'
				target='_blank'
				rel='noreferrer'
				href='https://www.facebook.com/every.day.digital.2023'>
				<img
					id='facebook'
					className='w-8 md:w-10 animate-invert'
					src={fbIcon}
					alt='Every Day Digital Facebook Page'
				/>
			</a>
			{/* <a className="md:mb-3 mr-3" href="#">
      <img id="instagram" className="w-8 md:w-10 animate-invert" src={igIcon} alt="Every Day Digital Instagram Page" /> 
    </a> */}
			<a
				className='md:mb-3 mr-3'
				target='_blank'
				rel='noreferrer'
				href='https://www.linkedin.com/company/every-day-digital/'>
				<img
					id='linkedin'
					className='w-8 md:w-10 animate-invert'
					src={liIcon}
					alt='Every Day Digital LinkedIn Page'
				/>
			</a>
		</div>
	);
};

export default SocialIcons;
