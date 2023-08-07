import React from 'react';

import useMatchMedia from "hooks/matchMedia";  

const CTAS = () => {
  const isDesktopResolution = useMatchMedia("(min-width:768px)", true);

  return (
    <div id="ctaContainer" >
      <button className={`${!!isDesktopResolution ? '' : 'cta-mobile'} cta mt-4 p-0 w-48`}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">CONTACT US</span>
      </button>
      <button className={`${!!isDesktopResolution ? '' : 'cta-mobile'} cta mt-4 p-0 w-48`}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">VIEW PRICING</span>
      </button>
    </div>
  );
};

export default CTAS;