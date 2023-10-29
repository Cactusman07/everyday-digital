/* A component used to fade out animate components just before being removed from the DOM */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SocialIcons } from 'components/ContentIndex';

import useMatchMedia from 'hooks/matchMedia';

const NavMenu = ({ menu }: any) => {
	const [isNavOpen, setIsNavOpen] = useState(false);
	const isDesktopResolution = useMatchMedia('(min-width:768px)', true);

	const m = [];
	if (!!menu) {
		menu.forEach((mi, index) => {
			m.push(
				<li
					key={index}
					className='border-b border-gray-400 hover:border-light-blue my-4 uppercase hover:text-light-blue'>
					<Link
						onClick={() => setIsNavOpen(false)}
						to={`${mi.uri}`}
						className='py-2'>
						{mi.title}
					</Link>
				</li>
			);
		});
	}
	m.reverse();

	return (
		<div className='flex items-center justify-between py-4 pr-4'>
			<nav>
				<section
					className='MOBILE-MENU flex cursor-pointer w-8 h-7 z-20 relative'
					onClick={() => setIsNavOpen((prev) => !prev)}>
					<div className='HAMBURGER-ICON space-y-2 grid cursor-pointer'>
						<span className='block h-0.5 w-8 animate-pulse bg-white'></span>
						<span className='block h-0.5 w-5 justify-self-end animate-pulse bg-white'></span>
						<span className='block h-0.5 w-8 animate-pulse bg-white'></span>
					</div>
				</section>
				<div id='navMenu' className={isNavOpen ? 'showMenuNav' : 'hideMenuNav'}>
					<div
						className='absolute top-0 right-0 pl-4 pt-8 pr-8'
						onClick={() => setIsNavOpen(false)}>
						<svg
							className='h-8 w-8 text-white cursor-pointer animate-pulse'
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
					<ul className='flex flex-col items-center justify-between min-h-[250px] text-xl'>
						{m}
					</ul>
					{!isDesktopResolution && (
						<div className='flex items-center justify-between mb-4'>
							<SocialIcons />
						</div>
					)}
				</div>
			</nav>
			<style>{`
      #navMenu{
        position: fixed;
        top: 0;
        bottom: 0;
        transition: all 500ms ease;
        background: #000;
        z-index: 50;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
      .hideMenuNav {
        width:0px;
        right:-300px;
        opacity: 0;
      }
      .showMenuNav {
        width: 100%;
        height: 100vh;
        right:0;
        opacity:1;
      }
      @media only screen and (min-width: 600px) {
        .showMenuNav{
          width: 40%;
          min-width:40vh;
          transition: all 500ms ease;
        }
      }
    `}</style>
		</div>
	);
};

export default NavMenu;
