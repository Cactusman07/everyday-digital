import React from 'react';

const HomeScreen = () => {
  const logo = require('../../assets/EveryDayDigital_Logo_reversed.png').default;

  return (
    <React.Fragment>
      <header className="h-[calc(100vh-40px)] mx-8 my-5 relative">
        <img id="logo" className="w-40 absolute top-0 left-0" src={logo} alt="Every Day Digital Logo" />  
        <div id="menu" className="absolute top-0 right-0">
          MENU
        </div>
        <div id="social" className="absolute bottom-0 left-0">
          Facey
          <br/>
          LinkedIn
        </div>
        <div id="title">
          <h1>Every Day <span id="text1"></span><span id="text2"></span></h1>          
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