import React from 'react';

const LandingSplashScreen = () => {
  const logo = require('../../assets/EveryDayDigital_Logo_reversed.png').default;

  return (
    <div className="fixed z-90 w-full h-full text-white flex justify-center items-center duration-500 bg-black">
      <div className="max-w-xs" id="logoContainer">
        <img id="splash_logo" src={logo} alt="Every Day Digital Logo" />      
        <div className="loading">
          <span className="loading__dot"></span>
          <span className="loading__dot"></span>
          <span className="loading__dot"></span>
        </div>
      </div>
    </div>
  );
};

export default LandingSplashScreen;