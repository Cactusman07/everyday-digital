import React from 'react';
import {
	NavMenu,
	SocialIcons,
	CTAS,
	PageContent,
} from 'components/ContentIndex';

import useMatchMedia from 'hooks/matchMedia';

const HomeScreen = () => {
	const logo =
		require('../../assets/EveryDayDigital_Logo_reversed.png').default;
	const isDesktopResolution = useMatchMedia('(min-width:768px)', true);

	return (
		<header
			id='header'
			className='h-[calc(100vh-40px)] mx-8 my-5 relative max-w-full'>
			<a
				className='absolute w-14 sm:w-20 top-0 left-0'
				href='https://www.everydaydigital.co.nz'>
				<img
					id='logo'
					className='animate-invert w-14 sm:w-20'
					src={logo}
					alt='Every Day Digital Logo'
				/>
			</a>
			<div id='menu' className='absolute top-0 right-0'>
				<NavMenu />
			</div>
			{isDesktopResolution && <SocialIcons absolutePos={true} />}
			<div className='fixed md:absolute bottom-0 md:bottom-5 md:left-auto z-[5] right-0 left-0 justify-center flex'>
				<CTAS />
			</div>
			<div
				id='title'
				className='transition-all duration-500 justify-center block text-8xl lg:text-[160px] xl:text-[210px] my-auto'>
				<h1 className='absolute transition-all duration-700'>
					Every Day&nbsp;
					<br className='sm:hidden' />
					<span id='textWrap'>
						<span id='text1'></span>
						<span id='text2'></span>
					</span>
				</h1>
			</div>
			<svg id='filters'>
				<defs>
					<filter id='threshold'>
						<feColorMatrix
							in='SourceGraphic'
							type='matrix'
							values='1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 255 -140'
						/>
					</filter>
				</defs>
			</svg>
			<PageContent content='test' featuredImage={{}} title={'test'} />
		</header>
	);
};

export default HomeScreen;
