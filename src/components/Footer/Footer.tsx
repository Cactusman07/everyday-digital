import React from 'react';

const Footer = () => {
	const year = new Date().getFullYear();

	return (
		<footer className='mx-8 mt-5 mb-2 text-center md:text-right left-0 right-0 bottom-0 absolute'>
			<div> &copy;{` Copyright ${year} Every Day Digital Limited`}</div>
		</footer>
	);
};

export default Footer;
