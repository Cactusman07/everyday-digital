import React from 'react';
import NavMenu from 'components/NavMenu/NavMenu';

const HomeScreen = () => {
  const logo = require('../../assets/EveryDayDigital_Logo_reversed.png').default;
  const fbIcon = require('../../assets/facebook-4-64.png').default;
  const igIcon = require('../../assets/instagram-4-64.png').default;
  const liIcon = require('../../assets/linkedin-4-64.png').default;

  return (
    <React.Fragment>
      <header id="header" className="h-[calc(100vh-40px)] mx-8 my-5 relative">
        <a href="https://www.everydaydigital.co.nz">
          <img id="logo" className="w-20 absolute top-0 left-0" src={logo} alt="Every Day Digital Logo" />  
        </a>
        <div id="menu" className="absolute top-0 right-0">
          <NavMenu />
        </div>
        <div id="social" className="absolute bottom-0 left-0">
          <a href="#">
            <img id="facebook" className="w-8 mb-3" src={fbIcon} alt="Every Day Digital Facebook Page" /> 
          </a>
          <a href="#">
            <img id="instagram" className="w-8 mb-3" src={igIcon} alt="Every Day Digital Instagram Page" /> 
          </a>
          <a href="#">
            <img id="linkedin" className="w-8 mb-3" src={liIcon} alt="Every Day Digital LinkedIn Page" /> 
          </a>
        </div>
        <div id="title">
          <h1>Every Day&nbsp;<span id="textWrap"><span id="text1"></span><span id="text2"></span></span></h1>
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