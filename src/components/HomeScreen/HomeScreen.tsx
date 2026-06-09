import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useContentContext } from 'index';

import {
	NavMenu,
	SocialIcons,
	CTAS,
	SvgBackground,
	ContentSlider,
} from 'components/ContentIndex';
import useMatchMedia from 'hooks/matchMedia';
import { WPPage } from '../../types';

const HomeScreen = ({ menu }: { menu: WPPage[] | null }) => {
	const logo =
			require('../../assets/EveryDayDigital_Logo_reversed.png').default,
		isDesktopResolution = useMatchMedia('(min-width:768px)', true),
		location = useLocation();

	const { showContent, toggleShowContent, contentData, updateContentData } =
		useContentContext();

	const [showFooter, setShowFooter] = useState(true),
		[showHeader, setShowHeader] = useState(true);

	const listenToScroll = useCallback(() => {
		const heightToHide = 80;
		const winScroll =
			document.body.scrollTop || document.documentElement.scrollTop;
		setShowHeader(winScroll <= heightToHide);
	}, []);

	useEffect(() => {
		setShowFooter(location.pathname === '/');
	}, [location]);

	useEffect(() => {
		window.addEventListener('scroll', listenToScroll);
		return () => window.removeEventListener('scroll', listenToScroll);
	}, [listenToScroll]);

	return (
		<>
			<SvgBackground />
			<header
				id='header'
				className='h-[calc(100vh-40px)] mx-8 my-5 relative max-w-full z-10'>
				{showHeader && (
					<Link className='absolute w-14 sm:w-20 top-0 left-0' to={'/'}>
						<img
							id='logo'
							className='animate-invert w-14 sm:w-20 z-30 relative'
							src={logo}
							alt='Every Day Digital Logo'
						/>
					</Link>
				)}

				{isDesktopResolution && showFooter && (
					<SocialIcons absolutePos={true} />
				)}
				{showFooter && (
					<div className='fixed md:absolute bottom-0 md:bottom-5 md:left-auto z-[5] right-0 left-0 justify-center flex'>
						<CTAS />
					</div>
				)}
				<div
					style={{ opacity: !showHeader ? 0 : 1 }}
					id='title'
					className='transition-all duration-500 justify-center block text-7xl sm:text-8xl lg:text-[160px] xl:text-[210px] my-auto'>
					<h1 className='absolute transition-all duration-700'>
						Every Day&nbsp;
						<br className='sm:hidden' />
						<span id='textWrap'>
							<span id='text1'>Digital</span>
							<span id='text2'></span>
						</span>
					</h1>
					{showFooter && (
						<Link
							to='/about/'
							className='absolute flex items-center gap-3 group'
							style={{ top: '64%', left: 0 }}>
							<span className='text-white/70 text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-300 group-hover:text-[#4bafeb]'>
								About our approach
							</span>
							<span className='flex items-center justify-center w-7 h-7 rounded-full border border-white/25 group-hover:border-[#4bafeb] transition-all duration-300'>
								<svg
									className='h-3 w-3 text-white/70 group-hover:text-[#4bafeb] transition-transform duration-300 group-hover:translate-x-px'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<line x1='5' y1='12' x2='19' y2='12' />
									<polyline points='12 5 19 12 12 19' />
								</svg>
							</span>
						</Link>
					)}
				</div>
				<svg id='filters' className='w-0 h-0'>
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
			</header>
			<div id='menu' className='absolute top-0 right-5'>
				<NavMenu menu={menu} />
			</div>
			<ContentSlider
				toggle={toggleShowContent}
				show={showContent}
				contentData={contentData}
				updateContentData={updateContentData}
			/>
		</>
	);
};

export default HomeScreen;
