import React from 'react';

import useMatchMedia from 'hooks/matchMedia';
import { Link } from 'react-router-dom';

const CTAS = () => {
	const isDesktopResolution = useMatchMedia('(min-width:768px)', true);

	return (
		<div id='ctas' className='inline-flex md:grid z-10 mb-12 gap-4'>
			<Link to='/contact'>
				<button
					className={`${
						!!isDesktopResolution ? '' : 'cta-mobile'
					} cta mt-4 p-0 md:w-48 w-36`}>
					<span className='circle' aria-hidden='true'>
						<span className='icon arrow'></span>
					</span>
					<span className='button-text'>CONTACT US</span>
				</button>
			</Link>
			<Link to='/services/'>
				<button
					className={`${
						!!isDesktopResolution ? '' : 'cta-mobile'
					} cta mt-4 p-0 md:w-48 w-36`}>
					<span className='circle' aria-hidden='true'>
						<span className='icon arrow'></span>
					</span>
					<span className='button-text'>VIEW SERVICES</span>
				</button>
			</Link>
		</div>
	);
};

export default CTAS;
