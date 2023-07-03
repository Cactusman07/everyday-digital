import React from 'react';
import NavMenu from 'components/NavMenu/NavMenu';

const HomeScreen = () => {
  const logo = require('../../assets/EveryDayDigital_Logo_reversed.png').default;
  const fbIcon = require('../../assets/facebook-4-64.png').default;
  const igIcon = require('../../assets/instagram-4-64.png').default;
  const liIcon = require('../../assets/linkedin-4-64.png').default;

  return (
    <React.Fragment>
      <header id="header" className="h-[calc(100vh-40px)] mx-8 my-5 relative max-w-full">
        <a className="absolute w-14 sm:w-20 top-0 left-0" href="https://www.everydaydigital.co.nz">
          <img id="logo" className="animate-invert w-14 sm:w-20" src={logo} alt="Every Day Digital Logo" />  
        </a>
        <div id="menu" className="absolute top-0 right-0">
          <NavMenu />
        </div>
        <div id="social" className="flex md:block absolute bottom-0 left-0">
          <a className="md:mb-3 mr-3" href="#">
            <img id="facebook" className="w-8 md:w-10 animate-invert" src={fbIcon} alt="Every Day Digital Facebook Page" /> 
          </a>
          <a className="md:mb-3 mr-3" href="#">
            <img id="instagram" className="w-8 md:w-10 animate-invert" src={igIcon} alt="Every Day Digital Instagram Page" /> 
          </a>
          <a className="md:mb-3 mr-3" href="#">
            <img id="linkedin" className="w-8 md:w-10 animate-invert" src={liIcon} alt="Every Day Digital LinkedIn Page" /> 
          </a>
        </div>
        <div id="ctaContainer" className="fixed bottom-5 right-8 flex z-[90]">
          <button className="cta mt-4 p-0 w-48">
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">CONTACT US</span>
          </button>
          <button className="cta mt-4 p-0 w-48">
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">VIEW PRICING</span>
          </button>
        </div>
        <div id="title" className="text-8xl sm:text-9xl lg:text-[175px] xl:text-[210px] my-auto ml-8 lg:ml-20">
          <h1 className="absolute">Every Day&nbsp;<br className="md:hidden"/><span id="textWrap"><span id="text1"></span><span id="text2"></span></span></h1>
        </div>
        <svg id="filters">
          <defs>
            <filter id="threshold">
                <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140" />
            </filter>
          </defs>
        </svg>
      </header>
    </React.Fragment>
  );
};

export default HomeScreen;