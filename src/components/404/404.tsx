import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
	useEffect(() => {
		document.body.classList.add('inner-page');
		return () => document.body.classList.remove('inner-page');
	}, []);

	return (
		<div id='content' className='mt-48 mb-24 mx-8 relative z-0'>
			<h2>Oops! That link doesn't seem to work!</h2>
			<div className='mt-5'>
				<p>
					No need to worry. Here are some helpful links to get you back on
					track:
				</p>
				<ul className='mt-4 ml-2 text-lg'>
					<li className='mt-2'>
						<p>
							<Link to='/'>Home</Link>
						</p>
					</li>
					<li className='mt-2'>
						<p>
							<Link to='/blog'>Blog</Link>
						</p>
					</li>
					<li className='mt-2'>
						<p>
							<Link to='/contact'>Contact</Link>
						</p>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default NotFound;
